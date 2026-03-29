from supabase import create_client, Client

# Hardcoded from .env to avoid dotenv missing in venv
url = "https://qxdjjeslmbeevkbiwdlf.supabase.co"
key = "sb_publishable_1DpshT9tDNcpn78ktUHQ0Q_uo2fndHq"

supabase: Client = create_client(url, key)

def diagnostico():
    print("--- DIAGNÓSTICO DO BANCO DE DADOS (HIDDEN) ---")
    
    # Alunos
    alunos = supabase.table("alunos").select("*").execute()
    print(f"\nAlunos ({len(alunos.data)}):")
    for a in alunos.data:
        print(f"  - ID: {a['id']} | Nome: {a['nome']}")
        
    # Responsáveis
    responsaveis = supabase.table("responsaveis").select("*").execute()
    print(f"\nResponsáveis ({len(responsaveis.data)}):")
    for r in responsaveis.data:
        print(f"  - ID: {r['id']} | Nome: {r['nome']}")
        
    # Vínculos
    vinculos = supabase.table("aluno_responsavel").select("*").execute()
    print(f"\nVínculos ({len(vinculos.data)}):")
    for v in vinculos.data:
        aluno_id = v.get('aluno_id')
        resp_id = v.get('responsavel_id')
        print(f"  - Aluno: {aluno_id} | Responsável: {resp_id}")

if __name__ == "__main__":
    diagnostico()
