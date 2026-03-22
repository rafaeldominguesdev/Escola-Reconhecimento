from pathlib import Path
from typing import Any, Optional
import os

from dotenv import load_dotenv
from supabase import create_client, Client


# =========================
# CONFIG
# =========================
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL ou SUPABASE_KEY não encontrados no .env")

supabase: Client = create_client(url, key)


# =========================
# HELPERS
# =========================
def _limpar_none(dados: dict) -> dict:
    return {k: v for k, v in dados.items() if v is not None}


def _primeiro(lista):
    return lista[0] if lista else None


# =========================
# COMPATIBILIDADE
# =========================
def criar_tabelas():
    """
    Mantida só para compatibilidade com código antigo.
    No Supabase, as tabelas já devem existir no banco.
    """
    return True


# =========================
# ALUNOS
# =========================
def listar_alunos():
    resp = supabase.table("alunos").select("*").order("id").execute()
    return resp.data or []


def buscar_aluno_por_id(aluno_id: int):
    resp = supabase.table("alunos").select("*").eq("id", aluno_id).limit(1).execute()
    return _primeiro(resp.data or [])


def buscar_aluno_por_nome(nome: str):
    resp = supabase.table("alunos").select("*").ilike("nome", nome).execute()
    return resp.data or []


def inserir_aluno(nome: str, turma: Optional[str] = None, foto_path: Optional[str] = None):
    dados = _limpar_none({
        "nome": nome,
        "turma": turma,
        "foto_path": foto_path
    })
    resp = supabase.table("alunos").insert(dados).execute()
    return _primeiro(resp.data or [])


def inserir_aluno_inicial(
    nome: str,
    turma: Optional[str] = None,
    foto_path: Optional[str] = None,
    responsavel_nome: Optional[str] = None,
    responsavel_telefone: Optional[str] = None,
    email: Optional[str] = None,
    **kwargs: Any
):
    """
    Função compatível com código antigo.
    Cria aluno e, se vierem dados do responsável, já cria e vincula.
    """

    # aceita nomes alternativos vindos do app antigo
    foto_path = (
        foto_path
        or kwargs.get("caminho_foto")
        or kwargs.get("foto")
        or kwargs.get("imagem")
    )

    responsavel_nome = (
        responsavel_nome
        or kwargs.get("responsavel")
        or kwargs.get("nome_responsavel")
    )

    responsavel_telefone = (
        responsavel_telefone
        or kwargs.get("telefone")
        or kwargs.get("telefone_responsavel")
    )

    email = (
        email
        or kwargs.get("responsavel_email")
        or kwargs.get("email_responsavel")
    )

    aluno = inserir_aluno(nome=nome, turma=turma, foto_path=foto_path)
    if not aluno:
        return None

    if responsavel_nome and responsavel_telefone:
        responsavel = inserir_responsavel(
            nome=responsavel_nome,
            telefone=responsavel_telefone,
            email=email
        )
        if responsavel:
            vincular_aluno_responsavel(aluno["id"], responsavel["id"])

    return aluno


# =========================
# RESPONSÁVEIS
# =========================
def listar_responsaveis():
    resp = supabase.table("responsaveis").select("*").order("id").execute()
    return resp.data or []


def inserir_responsavel(nome: str, telefone: str, email: Optional[str] = None):
    dados = _limpar_none({
        "nome": nome,
        "telefone": telefone,
        "email": email
    })
    resp = supabase.table("responsaveis").insert(dados).execute()
    return _primeiro(resp.data or [])


def buscar_responsavel_por_id(responsavel_id: int):
    resp = supabase.table("responsaveis").select("*").eq("id", responsavel_id).limit(1).execute()
    return _primeiro(resp.data or [])


# =========================
# VÍNCULO ALUNO <-> RESPONSÁVEL
# =========================
def vincular_aluno_responsavel(aluno_id: int, responsavel_id: int):
    dados = {
        "aluno_id": aluno_id,
        "responsavel_id": responsavel_id
    }
    resp = supabase.table("aluno_responsavel").insert(dados).execute()
    return _primeiro(resp.data or [])


def buscar_responsaveis_do_aluno(aluno_id: int):
    vinculos = supabase.table("aluno_responsavel").select("*").eq("aluno_id", aluno_id).execute().data or []
    if not vinculos:
        return []

    ids = [v["responsavel_id"] for v in vinculos]
    resp = supabase.table("responsaveis").select("*").in_("id", ids).order("id").execute()
    return resp.data or []


# =========================
# REGISTROS DE ENTRADA / SAÍDA
# =========================
def registrar_evento(
    aluno_id: int,
    tipo: str,
    mensagem_enviada: bool = False,
    observacao: Optional[str] = None
):
    tipo = tipo.lower().strip()
    if tipo not in ("entrada", "saida"):
        raise ValueError("tipo deve ser 'entrada' ou 'saida'")

    dados = _limpar_none({
        "aluno_id": aluno_id,
        "tipo": tipo,
        "mensagem_enviada": mensagem_enviada,
        "observacao": observacao
    })

    resp = supabase.table("registros").insert(dados).execute()
    return _primeiro(resp.data or [])


def registrar_entrada(aluno_id: int, observacao: Optional[str] = None):
    return registrar_evento(aluno_id, "entrada", False, observacao)


def registrar_saida(aluno_id: int, observacao: Optional[str] = None):
    return registrar_evento(aluno_id, "saida", False, observacao)


def listar_registros():
    resp = supabase.table("registros").select("*").order("id", desc=True).execute()
    return resp.data or []


def listar_registros_do_aluno(aluno_id: int):
    resp = (
        supabase
        .table("registros")
        .select("*")
        .eq("aluno_id", aluno_id)
        .order("id", desc=True)
        .execute()
    )
    return resp.data or []


def buscar_ultimo_registro_do_aluno(aluno_id: int):
    resp = (
        supabase
        .table("registros")
        .select("*")
        .eq("aluno_id", aluno_id)
        .order("id", desc=True)
        .limit(1)
        .execute()
    )
    return _primeiro(resp.data or [])


def marcar_mensagem_enviada(registro_id: int, enviado: bool = True):
    resp = (
        supabase
        .table("registros")
        .update({"mensagem_enviada": enviado})
        .eq("id", registro_id)
        .execute()
    )
    return _primeiro(resp.data or [])