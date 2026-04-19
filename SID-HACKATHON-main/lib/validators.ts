import { z } from "zod";

// --- Input Validators ---

export const UserInputsSchema = z.object({
  netZeroTarget: z.boolean(),
  emissionReductionPercentage: z.number().min(0).max(100).optional(),
  capexBudget: z.number().min(0),
  opexBudget: z.number().min(0),
  maxAbatementCost: z.number().min(0),
  minTrl: z.number().min(1).max(9).default(1),
  maxTrl: z.number().min(1).max(9).default(9),
  initialRoadmapPeriod: z.object({
    startYear: z.number().min(2024),
    endYear: z.number().min(2024),
  }),
  targetYear: z.number().min(2024),
}).refine(data => data.initialRoadmapPeriod.endYear >= data.initialRoadmapPeriod.startYear, {
  message: "Ano final do ciclo deve ser maior ou igual ao inicial",
  path: ["initialRoadmapPeriod", "endYear"]
}).refine(data => data.targetYear >= data.initialRoadmapPeriod.endYear, {
  message: "Horizonte final deve ser maior ou igual ao final do ciclo inicial",
  path: ["targetYear"]
});

// --- Entity Validators (Supabase Mirror) ---

export const TechnologySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string(),
  mitigationPotential: z.number(),
  economicViability: z.object({
    capex: z.number(),
    opex: z.number(),
    abatementCost: z.number(),
    roi: z.number(),
    paybackPeriod: z.number(),
  }),
  implementation: z.object({
    trl: z.number().min(1).max(9),
    challenges: z.array(z.string()),
  }),
  marketCompetition: z.string().optional(),
});

export const RoadmapStepSchema = z.object({
  id: z.string().uuid().optional(),
  technologyId: z.string().uuid(),
  startYear: z.number(),
  endYear: z.number(),
});

export const RoadmapSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  targetYear: z.number(),
  netZeroTarget: z.boolean(),
  capexBudget: z.number(),
  opexBudget: z.number(),
  steps: z.array(RoadmapStepSchema),
});

// --- Types derived from Zod ---

export type UserInputsDTO = z.infer<typeof UserInputsSchema>;
export type TechnologyDTO = z.infer<typeof TechnologySchema>;
export type RoadmapDTO = z.infer<typeof RoadmapSchema>;
export type RoadmapStepDTO = z.infer<typeof RoadmapStepSchema>;
