import tkinter as tk
from tkinter import messagebox
import tkinter.simpledialog as simpledialog
import cv2
import os
from database import (
    criar_tabelas, 
    inserir_aluno_inicial, 
    atualizar_pasta_fotos, 
    verifica_aluno_existe,
    excluir_aluno,
    listar_alunos
)

class AppCadastro:
    def __init__(self, root):
        self.root = root
        self.root.title("Cadastro de Alunos - Sistema Escolar")
        self.root.geometry("550x650")
        
        # Garante que as tabelas do banco de dados existam
        criar_tabelas()
        
        # Variáveis para armazenar o texto digitado
        self.nome_var = tk.StringVar()
        self.turma_var = tk.StringVar()
        self.numero_var = tk.StringVar()
        self.resp_var = tk.StringVar()
        self.email_var = tk.StringVar()
        self.tele_var = tk.StringVar()
        
        # Título
        tk.Label(root, text="Módulo de Cadastro de Alunos", font=("Arial", 16, "bold")).pack(pady=10)
        
        # Formulário
        tk.Label(root, text="Nome Completo do Aluno:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.nome_var, width=50).pack(pady=2)
        
        tk.Label(root, text="Turma / Série (Ex: 2A):", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.turma_var, width=50).pack(pady=2)
        
        tk.Label(root, text="Número da Chamada:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.numero_var, width=50).pack(pady=2)
        
        tk.Label(root, text="Nome do Responsável:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.resp_var, width=50).pack(pady=2)
        
        tk.Label(root, text="Email do Responsável:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.email_var, width=50).pack(pady=2)
        
        tk.Label(root, text="Telefone do Responsável:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.tele_var, width=50).pack(pady=2)
        
        # Botões
        self.btn_cadastrar = tk.Button(
            root, text="Iniciar Cadastro e Capturar Fotos", 
            command=self.iniciar_captura, bg="#0052cc", fg="white", font=("Arial", 12, "bold")
        )
        self.btn_cadastrar.pack(pady=15)
        
        self.btn_listar = tk.Button(
            root, text="Listar Alunos Cadastrados", 
            command=self.mostrar_lista_alunos, bg="#28a745", fg="white", font=("Arial", 10)
        )
        self.btn_listar.pack(pady=5)
        
    def iniciar_captura(self):
        # 1. Coletar e validar os dados
        nome = self.nome_var.get().strip()
        turma = self.turma_var.get().strip()
        numero_str = self.numero_var.get().strip()
        resp = self.resp_var.get().strip()
        email = self.email_var.get().strip()
        tele = self.tele_var.get().strip()
        
        if not all([nome, turma, numero_str, resp, email, tele]):
            messagebox.showwarning("Aviso", "Preencha todos os campos do formulário!")
            return
            
        if not numero_str.isdigit():
            messagebox.showwarning("Aviso", "O número da chamada deve conter apenas números inteiros!")
            return
            
        numero_chamada = int(numero_str)
        
        # 2. Verificar duplicidade de aluno (mesma turma e número)
        if verifica_aluno_existe(turma, numero_chamada):
            messagebox.showerror("Erro", f"Já existe um aluno cadastrado na turma {turma} com o número {numero_chamada}.")
            return
            
        # 3. Inserir no banco para obter o ID gerado automaticamente (AutoIncrement)
        id_aluno = inserir_aluno_inicial(nome, turma, numero_chamada, resp, email, tele)
        
        # 4. Criar as pastas baseadas no ID do aluno
        pasta_base = "fotos"
        if not os.path.exists(pasta_base):
            os.makedirs(pasta_base)
            
        nome_pasta_aluno = f"aluno_{id_aluno}"
        pasta_aluno = os.path.join(pasta_base, nome_pasta_aluno)
        
        if not os.path.exists(pasta_aluno):
            os.makedirs(pasta_aluno)
            
        # Atualiza a pasta de fotos correta no banco de dados
        atualizar_pasta_fotos(id_aluno, pasta_aluno)
        
        # 5. Iniciar a webcam
        cap = cv2.VideoCapture(0) 
        
        if not cap.isOpened():
            messagebox.showerror("Erro", "Não foi possível acessar a webcam!")
            excluir_aluno(id_aluno) # Em caso de falha de hardware, revertemos a inserção no banco
            return
            
        fotos_capturadas = 0
        total_fotos = 10
        
        messagebox.showinfo(
            "Câmera Pronta", 
            "A câmera vai abrir agora.\nPeça para o aluno olhar para a lente e aguarde as fotos."
        )
        
        # 6. Loop de captura com imagens sequenciais (1.jpg, 2.jpg, etc.)
        while fotos_capturadas < total_fotos:
            ret, frame = cap.read()
            if not ret:
                messagebox.showerror("Erro", "Falha ao ler o vídeo da webcam.")
                break
                
            frame_display = frame.copy()
            cv2.putText(frame_display, f"Capturando: {fotos_capturadas+1}/{total_fotos}", (30, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow("Captura de Rosto (Pressione 'q' para cancelar)", frame_display)
            
            # Formato estrito para as imagens como solicitado
            caminho_foto = os.path.join(pasta_aluno, f"{fotos_capturadas+1}.jpg")
            cv2.imwrite(caminho_foto, frame)
            
            fotos_capturadas += 1
            
            if cv2.waitKey(500) & 0xFF == ord('q'):
                break
                
        cap.release()
        cv2.destroyAllWindows()
        
        # 7. Finalização
        if fotos_capturadas > 0:
            messagebox.showinfo("Sucesso", f"Cadastro do aluno ID {id_aluno} realizado com sucesso!\n{fotos_capturadas} fotos salvas em {pasta_aluno}.")
            self.limpar_campos()
        else:
            # Se a captura for cancelada antes da primeira foto, excluir do banco
            messagebox.showwarning("Aviso", "Nenhuma foto foi capturada. O cadastro foi cancelado.")
            excluir_aluno(id_aluno)

    def mostrar_lista_alunos(self):
        """Abre uma nova janela mostrando todos os alunos cadastrados"""
        alunos = listar_alunos()
        if not alunos:
            messagebox.showinfo("Lista de Alunos", "Nenhum aluno cadastrado ainda.")
            return
            
        texto_lista = "\n".join(alunos)
        
        # Cria uma nova janela apenas para mostrar a lista
        janela_lista = tk.Toplevel(self.root)
        janela_lista.title("Alunos Cadastrados")
        janela_lista.geometry("500x400")
        
        tk.Label(janela_lista, text="Lista de Alunos", font=("Arial", 14, "bold")).pack(pady=10)
        
        scrollbar = tk.Scrollbar(janela_lista)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        lista_box = tk.Text(janela_lista, yscrollcommand=scrollbar.set, font=("Courier", 10), padx=10, pady=10)
        lista_box.pack(expand=True, fill=tk.BOTH, padx=10, pady=10)
        lista_box.insert(tk.END, texto_lista)
        lista_box.config(state=tk.DISABLED) # Impede edição do texto
        
        scrollbar.config(command=lista_box.yview)

    def limpar_campos(self):
        """Limpa os campos para o próximo cadastro."""
        self.nome_var.set("")
        self.turma_var.set("")
        self.numero_var.set("")
        self.resp_var.set("")
        self.email_var.set("")
        self.tele_var.set("")

if __name__ == "__main__":
    root = tk.Tk()
    app = AppCadastro(root)
    root.mainloop()
