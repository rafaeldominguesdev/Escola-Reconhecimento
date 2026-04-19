import { TechnologyDTO, UserInputsDTO, RoadmapStepDTO } from "../lib/validators";
import { strategyEngine } from "../lib/engine";

/**
 * MOCK DATA SEEDER
 * These will be moved to the Supabase 'technologies' table.
 */
export const mockTechnologies: TechnologyDTO[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Captura Direta de Ar (DAC)",
    description: "Tecnologia que remove CO2 diretamente da atmosfera utilizando ciclos termoquímicos.",
    mitigationPotential: 500000,
    economicViability: {
      capex: 100000000,
      opex: 5000000,
      abatementCost: 200,
      roi: 0.08,
      paybackPeriod: 12,
    },
    implementation: {
      trl: 7,
      challenges: ["Consumo de Energia", "Custo Inicial"],
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Eletrificação de Frotas",
    description: "Substituição progressiva de veículos a combustão por veículos 100% elétricos.",
    mitigationPotential: 150000,
    economicViability: {
      capex: 15000000,
      opex: 1000000,
      abatementCost: 50,
      roi: 0.22,
      paybackPeriod: 4,
    },
    implementation: {
      trl: 9,
      challenges: ["Infraestrutura de Recarga"],
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Biocombustíveis Avançados",
    description: "Produção de combustíveis de segunda geração a partir de biomassa sustentável.",
    mitigationPotential: 300000,
    economicViability: {
      capex: 70000000,
      opex: 3000000,
      abatementCost: 120,
      roi: 0.12,
      paybackPeriod: 8,
    },
    implementation: {
      trl: 8,
      challenges: ["Disponibilidade de Matéria-Prima"],
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Painéis Fotovoltaicos",
    description: "Instalação de painéis solares de alta eficiência (>22%) localmente.",
    mitigationPotential: 120000,
    economicViability: {
      capex: 10000000,
      opex: 500000,
      abatementCost: 35,
      roi: 0.28,
      paybackPeriod: 3,
    },
    implementation: {
      trl: 9,
      challenges: ["Espaço Disponível"],
    },
  },
];

/**
 * REFACTORED ENGINE WRAPPERS
 * These now bridge the UI to the Strategy Engine.
 * In Phase 10, these will fetch from 'roadmapService'.
 */

export const generateInitialCycleSuggestions = (inputs: UserInputsDTO): TechnologyDTO[] => {
  return strategyEngine.getSuggestions(mockTechnologies, inputs);
};

export const generateNextCycleSuggestions = (lastEndYear: number, inputs: UserInputsDTO, currentSteps: any[]): TechnologyDTO[] => {
  // Convert steps to DTOs for engine logic
  const stepsDTO: RoadmapStepDTO[] = currentSteps.map(s => ({
    technologyId: s.technology.id,
    startYear: s.startYear,
    endYear: s.endYear
  }));

  return strategyEngine.getSuggestions(mockTechnologies, inputs, stepsDTO);
};
