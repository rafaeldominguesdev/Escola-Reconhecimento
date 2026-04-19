export interface UserInputs {
  netZeroTarget: boolean; // true se Net Zero 2050, false se meta percentual
  emissionReductionPercentage?: number; // 0-100, se netZeroTarget for false
  capexBudget: number; // Orçamento CAPEX anual
  opexBudget: number; // Orçamento OPEX anual
  maxAbatementCost: number; // Custo de mitigação máximo $/tCO2e
  minTrl: number; // TRL mínimo preferencial
  maxTrl: number; // TRL máximo preferencial
  initialRoadmapPeriod: { startYear: number; endYear: number }; // Período do primeiro ciclo
  targetYear: number; // Horizonte final do planejamento (ex: 2050)
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  mitigationPotential: number; // em tCO2e/ano
  economicViability: {
    capex: number; // Custo de Investimento
    opex: number; // Custo Operacional Anual
    abatementCost: number; // Custo por tonelada de CO2e mitigada
    roi: number; // Retorno sobre Investimento (ex: 0.15 para 15%)
    paybackPeriod: number; // Período de Payback em anos
  };
  implementation: {
    trl: number; // Technology Readiness Level (1-9)
    challenges: string[]; // ex: ["Regulamentação", "Infraestrutura", "Integração de Sistemas"]
  };
  marketCompetition: string; // Análise breve sobre tecnologias concorrentes
}

export interface RoadmapStep {
  id: string;
  technology: Technology;
  startYear: number;
  endYear: number;
}
