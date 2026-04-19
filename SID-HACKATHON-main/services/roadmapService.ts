import { supabase } from "@/lib/supabase";
import { RoadmapDTO, TechnologyDTO } from "@/lib/validators";
import { Technology } from "@/types/decarbonization";

/**
 * Service to handle all interactions with the Supabase database
 * related to Roadmaps and Technologies.
 */
export const roadmapService = {
  // --- Technologies ---
  
  /**
   * Upserts a technology into the database by name.
   * This ensures that AI-generated technologies are stored before being linked.
   */
  async upsertTechnology(tech: Technology): Promise<string> {
    // We attempt to find by name first to avoid duplicates
    const { data: existing } = await supabase
      .from('technologies')
      .select('id')
      .eq('name', tech.name)
      .maybeSingle();

    if (existing) return existing.id;

    // Insert new technology
    const { data, error } = await supabase
      .from('technologies')
      .insert({
        name: tech.name,
        description: tech.description,
        mitigation_potential: tech.mitigationPotential,
        capex: tech.economicViability.capex,
        opex: tech.economicViability.opex,
        abatement_cost: tech.economicViability.abatementCost,
        roi: tech.economicViability.roi,
        payback_period: tech.economicViability.paybackPeriod,
        trl: tech.implementation.trl,
        challenges: tech.implementation.challenges,
        market_competition: tech.marketCompetition
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  // --- Roadmaps ---

  /**
   * Saves a full roadmap (metadata + steps) to Supabase.
   * It handles the logic of upserting missing technologies first.
   */
  async saveFullRoadmap(roadmap: any, userId: string): Promise<string> {
    // 1. First, ensure all technologies in the steps are in the database
    const stepWithTechIds = await Promise.all(
      roadmap.steps.map(async (step: any) => {
        const techId = await this.upsertTechnology(step.technology);
        return {
          ...step,
          tech_id: techId
        };
      })
    );

    // 2. Insert the Roadmap metadata
    const { data: roadmapData, error: roadmapError } = await supabase
      .from('roadmaps')
      .insert({
        user_id: userId,
        title: roadmap.title || 'Estratégia SID Engine',
        target_year: roadmap.targetYear,
        net_zero_target: roadmap.netZeroTarget,
        capex_budget: roadmap.capexBudget,
        opex_budget: roadmap.opexBudget
      })
      .select()
      .single();

    if (roadmapError) throw roadmapError;

    // 3. Insert all steps
    const stepsToInsert = stepWithTechIds.map(step => ({
      roadmap_id: roadmapData.id,
      tech_id: step.tech_id,
      start_year: step.startYear,
      end_year: step.endYear
    }));

    const { error: stepsError } = await supabase
      .from('roadmap_steps')
      .insert(stepsToInsert);

    if (stepsError) throw stepsError;

    return roadmapData.id;
  },

  /**
   * Fetches all saved roadmaps for the current user
   */
  async getUserRoadmaps(userId: string) {
    const { data, error } = await supabase
      .from('roadmaps')
      .select(`
        *,
        roadmap_steps (
          *,
          technologies (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a roadmap and its associated steps
   */
  async deleteRoadmap(roadmapId: string) {
    const { error } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', roadmapId);

    if (error) throw error;
  }
};
