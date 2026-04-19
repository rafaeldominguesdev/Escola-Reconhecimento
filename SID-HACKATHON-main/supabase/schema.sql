-- 1. PROFILES (Extensão de Users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TECHNOLOGIES (Catálogo Central)
CREATE TABLE technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  mitigation_potential INTEGER NOT NULL, -- tCO2e/ano
  capex DECIMAL NOT NULL,
  opex DECIMAL NOT NULL,
  abatement_cost DECIMAL NOT NULL,
  roi DECIMAL NOT NULL,
  payback_period INTEGER NOT NULL,
  trl INTEGER NOT NULL,
  challenges TEXT[] DEFAULT '{}',
  market_competition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ROADMAPS (Simulações do Usuário)
CREATE TABLE roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Estratégia de Descarbonização',
  target_year INTEGER NOT NULL DEFAULT 2050,
  net_zero_target BOOLEAN NOT NULL DEFAULT true,
  capex_budget DECIMAL NOT NULL,
  opex_budget DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ROADMAP_STEPS (Ciclos da Linha do Tempo)
CREATE TABLE roadmap_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID REFERENCES roadmaps ON DELETE CASCADE NOT NULL,
  tech_id UUID REFERENCES technologies NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (ROW LEVEL SECURITY)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY; -- Read-only for all, write for admin (manual)

-- Políticas para Profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para Roadmaps
CREATE POLICY "Users can view their own roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own roadmaps" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own roadmaps" ON roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Steps
CREATE POLICY "Users can manage steps for their own roadmaps" ON roadmap_steps 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_steps.roadmap_id AND roadmaps.user_id = auth.uid()
  )
);

-- Políticas para Technologies
CREATE POLICY "Anyone can view technologies" ON technologies FOR SELECT TO authenticated USING (true);
