import sqlite3
import os

DB_NAME = "escola.db"

def conectar():
    """Cria e retorna uma conexão com o banco de dados SQLite."""
    return sqlite3.connect(DB_NAME)

def criar_tabelas():
    """Verifica e cria a tabela de alunos caso ainda não exista."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            turma TEXT NOT NULL,
            numero_chamada INTEGER NOT NULL,
            nome_responsavel TEXT NOT NULL,
            email_responsavel TEXT NOT NULL,
            telefone_responsavel TEXT NOT NULL,
            pasta_fotos TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def verifica_aluno_existe(turma, numero_chamada):
    """Verifica se já existe um aluno cadastrado nesta turma com este número."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM alunos WHERE turma = ? AND numero_chamada = ?', (turma, numero_chamada))
    resultado = cursor.fetchone()
    conn.close()
    return resultado is not None

def inserir_aluno_inicial(nome, turma, numero_chamada, nome_responsavel, email, telefone):
    """
    Insere o aluno sem a pasta de fotos para gerar o ID automaticamente.
    Retorna o ID gerado (AUTOINCREMENT).
    """
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO alunos (nome, turma, numero_chamada, nome_responsavel, email_responsavel, telefone_responsavel, pasta_fotos)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (nome, turma, numero_chamada, nome_responsavel, email, telefone, ""))
    id_gerado = cursor.lastrowid
    conn.commit()
    conn.close()
    return id_gerado

def atualizar_pasta_fotos(id_aluno, pasta_fotos):
    """Atualiza o caminho da pasta de fotos do aluno após a criação da pasta."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('UPDATE alunos SET pasta_fotos = ? WHERE id = ?', (pasta_fotos, id_aluno))
    conn.commit()
    conn.close()

def excluir_aluno(id_aluno):
    """Exclui um aluno caso o cadastro ou captura de fotos falhe."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM alunos WHERE id = ?', (id_aluno,))
    conn.commit()
    conn.close()

def buscar_aluno_por_id(id_aluno):
    """Busca nome, turma e número da chamada de um aluno específico pelo seu ID."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('SELECT nome, turma, numero_chamada FROM alunos WHERE id = ?', (id_aluno,))
    resultado = cursor.fetchone()
    conn.close()
    return resultado

def listar_alunos():
    """Retorna uma lista de strings formatadas com todos os alunos cadastrados."""
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('SELECT id, nome, turma, numero_chamada FROM alunos ORDER BY turma, numero_chamada')
    alunos = cursor.fetchall()
    conn.close()
    
    lista_formatada = []
    for aluno in alunos:
        id_aluno, nome, turma, numero = aluno
        lista_formatada.append(f"[ID: {id_aluno}] {nome} - Turma {turma} - Nº {numero}")
    
    return lista_formatada
