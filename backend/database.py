import shutil
from pathlib import Path
from typing import Any, Optional
import os
import mimetypes

from dotenv import load_dotenv
from supabase import create_client, Client


env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL ou SUPABASE_KEY não encontrados no .env")

supabase: Client = create_client(url, key)

BUCKET_FOTOS = "fotos-alunos"


def _limpar_none(dados: dict) -> dict:
    return {k: v for k, v in dados.items() if v is not None}


def _primeiro(lista):
    return lista[0] if lista else None


def criar_tabelas():
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


def inserir_aluno(nome: str, turma: Optional[str] = None, foto_path: Optional[str] = None):
    dados = _limpar_none({
        "nome": nome,
        "turma": turma,
        "foto_path": foto_path
    })
    resp = supabase.table("alunos").insert(dados).execute()
    return _primeiro(resp.data or [])


def atualizar_foto_aluno(aluno_id: int, foto_path: str):
    resp = (
        supabase
        .table("alunos")
        .update({"foto_path": foto_path})
        .eq("id", aluno_id)
        .execute()
    )
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
# VÍNCULO
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


def registrar_presenca_automatica(aluno_id: int, observacao: Optional[str] = None):
    ultimo = buscar_ultimo_registro_do_aluno(aluno_id)

    if not ultimo:
        return registrar_entrada(aluno_id, observacao)

    if ultimo["tipo"] == "entrada":
        return registrar_saida(aluno_id, observacao)

    return registrar_entrada(aluno_id, observacao)


def marcar_mensagem_enviada(registro_id: int, enviado: bool = True):
    resp = (
        supabase
        .table("registros")
        .update({"mensagem_enviada": enviado})
        .eq("id", registro_id)
        .execute()
    )
    return _primeiro(resp.data or [])


# =========================
# STORAGE
# =========================
def upload_foto_aluno(aluno_id: int, caminho_arquivo: str, nome_arquivo: Optional[str] = None):
    if not os.path.exists(caminho_arquivo):
        raise FileNotFoundError(f"Arquivo não encontrado: {caminho_arquivo}")

    extensao = os.path.splitext(caminho_arquivo)[1].lower() or ".jpg"
    if nome_arquivo is None:
        nome_arquivo = f"principal{extensao}"

    storage_path = f"alunos/{aluno_id}/{nome_arquivo}"
    content_type = mimetypes.guess_type(caminho_arquivo)[0] or "image/jpeg"

    with open(caminho_arquivo, "rb") as f:
        supabase.storage.from_(BUCKET_FOTOS).upload(
            path=storage_path,
            file=f,
            file_options={
                "content-type": content_type,
                "upsert": "true"
            }
        )

    atualizar_foto_aluno(aluno_id, storage_path)
    return storage_path


def obter_url_assinada_foto(foto_path: str, expira_em: int = 300):
    if not foto_path:
        return None

    resposta = supabase.storage.from_(BUCKET_FOTOS).create_signed_url(
        foto_path,
        expira_em
    )

    if isinstance(resposta, dict):
        return resposta.get("signedURL") or resposta.get("signedUrl") or resposta.get("signed_url")

    return resposta


# =========================
# EXCLUSÃO
# =========================
def excluir_aluno(aluno_id: int):
    aluno = buscar_aluno_por_id(aluno_id)
    if not aluno:
        return False, "Aluno não encontrado."

    # 1. Identificar responsáveis vinculados antes da exclusão
    try:
        vinculos = supabase.table("aluno_responsavel").select("responsavel_id").eq("aluno_id", aluno_id).execute().data or []
        responsavel_ids = [v["responsavel_id"] for v in vinculos]
    except Exception:
        responsavel_ids = []

    # 2. Remover foto do storage
    foto_path = aluno.get("foto_path")

    if foto_path:
        try:
            supabase.storage.from_(BUCKET_FOTOS).remove([foto_path])
        except Exception:
            pass

    # 3. Remover registros de acesso explicitamente
    try:
        supabase.table("registros").delete().eq("aluno_id", aluno_id).execute()
    except Exception:
        pass

    # 4. Remover vínculos na tabela aluno_responsavel
    try:
        supabase.table("aluno_responsavel").delete().eq("aluno_id", aluno_id).execute()
    except Exception:
        pass

    # 5. Remover o registro do aluno
    supabase.table("alunos").delete().eq("id", aluno_id).execute()

    # 6. Remover pasta local de fotos
    pasta_local = os.path.join("fotos", f"aluno_{aluno_id}")
    if os.path.exists(pasta_local):
        try:
            shutil.rmtree(pasta_local)
        except Exception:
            pass

    # 7. Deletar os responsáveis vinculados diretamente
    for resp_id in responsavel_ids:
        try:
            supabase.table("responsaveis").delete().eq("id", resp_id).execute()
        except Exception:
            pass

    return True, f"Aluno {aluno.get('nome', aluno_id)} e seu responsável excluídos com sucesso."

    # =========================
# STORAGE
# =========================
def upload_foto_aluno(aluno_id: int, caminho_arquivo: str, nome_arquivo: Optional[str] = None):
    if not os.path.exists(caminho_arquivo):
        raise FileNotFoundError(f"Arquivo não encontrado: {caminho_arquivo}")

    extensao = os.path.splitext(caminho_arquivo)[1].lower() or ".jpg"
    if nome_arquivo is None:
        nome_arquivo = f"principal{extensao}"

    storage_path = f"alunos/{aluno_id}/{nome_arquivo}"
    content_type = mimetypes.guess_type(caminho_arquivo)[0] or "image/jpeg"

    with open(caminho_arquivo, "rb") as f:
        supabase.storage.from_(BUCKET_FOTOS).upload(
            path=storage_path,
            file=f,
            file_options={
                "content-type": content_type,
                "upsert": "true"
            }
        )

    atualizar_foto_aluno(aluno_id, storage_path)
    return storage_path


def obter_url_assinada_foto(foto_path: str, expira_em: int = 300):
    if not foto_path:
        return None

    resposta = supabase.storage.from_(BUCKET_FOTOS).create_signed_url(
        foto_path,
        expira_em
    )

    if isinstance(resposta, dict):
        return resposta.get("signedURL") or resposta.get("signedUrl") or resposta.get("signed_url")

    return resposta