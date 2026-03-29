import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Carregar env
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("Erro: SUPABASE_URL ou SUPABASE_KEY ausentes")
    exit(1)

supabase: Client = create_client(url, key)

def diagnostico():
    print("--- DIAGNÓSTICO DO BANCO DE DADOS ---")
    
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
        print(f"  - Aluno: {v['aluno_id']} | Responsável: {v['responsavel_id']}")

if __name__ == "__main__":
    diagnostico()
