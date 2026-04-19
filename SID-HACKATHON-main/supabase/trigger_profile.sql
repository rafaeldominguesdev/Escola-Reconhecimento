-- TRIGGER: Auto-criar perfil quando usuário se cadastra
-- Cole e execute este SQL no Supabase SQL Editor

-- 1. Função que cria o perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger que dispara após cada signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Política de INSERT para profiles (faltava no schema original)
CREATE POLICY "Users can insert their own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);
