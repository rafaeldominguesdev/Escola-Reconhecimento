import { TechnologyDTO, UserInputsDTO, RoadmapStepDTO } from "./validators";

/**
 * SID Strategy Engine
 * Core logic for evaluating decarbonization pathways and suggesting cycles.
 */

export interface StrategyMetrics {
  totalReduction: number; // tCO2e
  remainingBudget: number; // BRL
  avgAbatementCost: number; // BRL/tCO2e
  totalROI: number;
}

export const strategyEngine = {
  /**
   * Filters and ranks technologies based on user constraints and impact
   */
  getSuggestions(
    allTechs: TechnologyDTO[],
    inputs: UserInputsDTO,
    currentRoadmap: RoadmapStepDTO[] = []
  ): TechnologyDTO[] {
    // 1. Calculate cumulative costs of current roadmap to see remaining budget
    // (Simplification for MVP: We check annual budget vs tech annual costs)
    
    // 2. Filter by TRL and Budget constraints
    let filtered = allTechs.filter(tech => {
      const withinTrl = tech.implementation.trl >= inputs.minTrl && tech.implementation.trl <= inputs.maxTrl;
      const withinCapex = tech.economicViability.capex <= inputs.capexBudget;
      const withinAbatement = tech.economicViability.abatementCost <= inputs.maxAbatementCost;
      
      // Prevent suggesting technologies already in the roadmap (unless scalable)
      const alreadyUsed = currentRoadmap.some(step => step.technologyId === tech.id);
      
      return withinTrl && withinCapex && withinAbatement && !alreadyUsed;
    });

    // 3. Score and Sort (Efficiency Factor: Mitigation / Cost)
    // We prioritize techs with lower abatement cost and higher potential
    return filtered.sort((a, b) => {
      const scoreA = (a.mitigationPotential * a.economicViability.roi) / a.economicViability.abatementCost;
      const scoreB = (b.mitigationPotential * b.economicViability.roi) / b.economicViability.abatementCost;
      return scoreB - scoreA;
    }).slice(0, 3); // Return top 3 strategic choices
  },

  /**
   * Calculates the cumulative impact of a roadmap
   */
  calculateMetrics(
    steps: { technology: TechnologyDTO; startYear: number; endYear: number }[],
    inputs: UserInputsDTO
  ): StrategyMetrics {
    let totalReduction = 0;
    let totalCapex = 0;
    let totalOpex = 0;
    let weightedRoi = 0;
    let totalAbatementCost = 0;

    steps.forEach(step => {
      const years = step.endYear - step.startYear;
      totalReduction += step.technology.mitigationPotential * years;
      totalCapex += step.technology.economicViability.capex;
      totalOpex += step.technology.economicViability.opex * years;
      weightedRoi += step.technology.economicViability.roi * (step.technology.mitigationPotential / 1000);
      totalAbatementCost += step.technology.economicViability.abatementCost;
    });

    return {
      totalReduction,
      remainingBudget: inputs.capexBudget - totalCapex, // Simplified
      avgAbatementCost: steps.length > 0 ? totalAbatementCost / steps.length : 0,
      totalROI: steps.length > 0 ? weightedRoi / steps.length : 0
    };
  },

  /**
   * Predicts the next cycle window
   */
  predictNextPeriod(lastEndYear: number, targetYear: number): { startYear: number, endYear: number } | null {
    if (lastEndYear >= targetYear) return null;
    
    const duration = 4; // Default cycle duration
    const endYear = Math.min(lastEndYear + duration, targetYear);
    
    return {
      startYear: lastEndYear,
      endYear: endYear
    };
  }
};
