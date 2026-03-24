import tkinter as tk
from tkinter import messagebox
import cv2  # type: ignore
import os

from database import (  # type: ignore
    criar_tabelas,
    inserir_aluno_inicial,
    listar_alunos,
    upload_foto_aluno,
    excluir_aluno
)


class AppCadastro:
    def __init__(self, root):
        self.root = root
        self.root.title("Cadastro de Alunos - Sistema Escolar")
        self.root.geometry("550x760")

        criar_tabelas()

        self.nome_var = tk.StringVar()
        self.turma_var = tk.StringVar()
        self.numero_var = tk.StringVar()
        self.resp_var = tk.StringVar()
        self.email_var = tk.StringVar()
        self.tele_var = tk.StringVar()
        self.excluir_id_var = tk.StringVar()

        tk.Label(root, text="Módulo de Cadastro de Alunos", font=("Arial", 16, "bold")).pack(pady=10)

        tk.Label(root, text="Nome Completo do Aluno:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.nome_var, width=50).pack(pady=2)

        tk.Label(root, text="Turma / Série (Ex: 2A):", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.turma_var, width=50).pack(pady=2)

        tk.Label(root, text="Número da Chamada (apenas visual por enquanto):", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.numero_var, width=50).pack(pady=2)

        tk.Label(root, text="Nome do Responsável:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.resp_var, width=50).pack(pady=2)

        tk.Label(root, text="Email do Responsável:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.email_var, width=50).pack(pady=2)

        tk.Label(root, text="Telefone do Responsável:", font=("Arial", 10)).pack(pady=2)
        tk.Entry(root, textvariable=self.tele_var, width=50).pack(pady=2)

        self.btn_cadastrar = tk.Button(
            root,
            text="Iniciar Cadastro e Capturar Fotos",
            command=self.iniciar_captura,
            bg="#0052cc",
            fg="white",
            font=("Arial", 12, "bold")
        )
        self.btn_cadastrar.pack(pady=15)

        self.btn_listar = tk.Button(
            root,
            text="Listar Alunos Cadastrados",
            command=self.mostrar_lista_alunos,
            bg="#28a745",
            fg="white",
            font=("Arial", 10)
        )
        self.btn_listar.pack(pady=5)

        tk.Label(root, text="Excluir aluno por ID:", font=("Arial", 10, "bold")).pack(pady=(15, 2))
        tk.Entry(root, textvariable=self.excluir_id_var, width=20).pack(pady=2)

        self.btn_excluir = tk.Button(
            root,
            text="Excluir Aluno",
            command=self.excluir_aluno_interface,
            bg="#dc3545",
            fg="white",
            font=("Arial", 10, "bold")
        )
        self.btn_excluir.pack(pady=8)

    def iniciar_captura(self):
        nome = self.nome_var.get().strip()
        turma = self.turma_var.get().strip()
        numero_str = self.numero_var.get().strip()
        resp = self.resp_var.get().strip()
        email = self.email_var.get().strip()
        tele = self.tele_var.get().strip()

        if not all([nome, turma, resp, email, tele]):
            messagebox.showwarning("Aviso", "Preencha todos os campos do formulário!")
            return

        if numero_str and not numero_str.isdigit():
            messagebox.showwarning("Aviso", "O número da chamada deve conter apenas números inteiros!")
            return

        aluno = inserir_aluno_inicial(
            nome=nome,
            turma=turma,
            responsavel_nome=resp,
            responsavel_telefone=tele,
            email=email
        )

        if not aluno:
            messagebox.showerror("Erro", "Não foi possível cadastrar o aluno no banco.")
            return

        id_aluno = aluno["id"]

        pasta_base = "fotos"
        if not os.path.exists(pasta_base):
            os.makedirs(pasta_base)

        nome_pasta_aluno = f"aluno_{id_aluno}"
        pasta_aluno = os.path.join(pasta_base, nome_pasta_aluno)

        if not os.path.exists(pasta_aluno):
            os.makedirs(pasta_aluno)

        cap = cv2.VideoCapture(0)

        if not cap.isOpened():
            messagebox.showerror("Erro", "Não foi possível acessar a webcam!")
            return

        fotos_capturadas = 0
        total_fotos = 10
        primeira_foto = None

        messagebox.showinfo(
            "Câmera Pronta",
            "A câmera vai abrir agora.\nPeça para o aluno olhar para a lente e aguarde as fotos."
        )

        while fotos_capturadas < total_fotos:
            ret, frame = cap.read()
            if not ret:
                messagebox.showerror("Erro", "Falha ao ler o vídeo da webcam.")
                break

            frame_display = frame.copy()
            cv2.putText(
                frame_display,
                f"Capturando: {fotos_capturadas + 1}/{total_fotos}",
                (30, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )
            cv2.imshow("Captura de Rosto (Pressione 'q' para cancelar)", frame_display)

            caminho_foto = os.path.join(pasta_aluno, f"{fotos_capturadas + 1}.jpg")
            cv2.imwrite(caminho_foto, frame)

            if primeira_foto is None:
                primeira_foto = caminho_foto

            fotos_capturadas += 1

            if cv2.waitKey(500) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

        if fotos_capturadas > 0:
            aviso_upload = ""

            try:
                if primeira_foto:
                    upload_foto_aluno(id_aluno, primeira_foto, "principal.jpg")
                    aviso_upload = "\nFoto principal enviada para o Supabase Storage."
            except Exception as e:
                aviso_upload = f"\nUpload para o Supabase falhou: {e}"

            messagebox.showinfo(
                "Sucesso",
                f"Cadastro do aluno ID {id_aluno} realizado com sucesso!\n"
                f"{fotos_capturadas} fotos salvas em {pasta_aluno}.{aviso_upload}"
            )
            self.limpar_campos()
        else:
            messagebox.showwarning(
                "Aviso",
                "Nenhuma foto foi capturada, mas o aluno já foi cadastrado no banco."
            )

    def mostrar_lista_alunos(self):
        alunos = listar_alunos()
        if not alunos:
            messagebox.showinfo("Lista de Alunos", "Nenhum aluno cadastrado ainda.")
            return

        texto_lista = "\n".join(
            f'ID: {a["id"]} | Nome: {a["nome"]} | Turma: {a.get("turma", "")} | Foto: {a.get("foto_path", "")}'
            for a in alunos
        )

        janela_lista = tk.Toplevel(self.root)
        janela_lista.title("Alunos Cadastrados")
        janela_lista.geometry("700x400")

        tk.Label(janela_lista, text="Lista de Alunos", font=("Arial", 14, "bold")).pack(pady=10)

        scrollbar = tk.Scrollbar(janela_lista)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        lista_box = tk.Text(
            janela_lista,
            yscrollcommand=scrollbar.set,
            font=("Courier", 10),
            padx=10,
            pady=10
        )
        lista_box.pack(expand=True, fill=tk.BOTH, padx=10, pady=10)
        lista_box.insert(tk.END, texto_lista)
        lista_box.config(state=tk.DISABLED)

        scrollbar.config(command=lista_box.yview)

    def excluir_aluno_interface(self):
        aluno_id_str = self.excluir_id_var.get().strip()

        if not aluno_id_str:
            messagebox.showwarning("Aviso", "Digite o ID do aluno que deseja excluir.")
            return

        if not aluno_id_str.isdigit():
            messagebox.showwarning("Aviso", "O ID do aluno deve ser numérico.")
            return

        aluno_id = int(aluno_id_str)

        confirmar = messagebox.askyesno(
            "Confirmar exclusão",
            f"Tem certeza que deseja excluir o aluno ID {aluno_id}?\n\n"
            "Isso vai apagar:\n"
            "- o aluno no banco\n"
            "- os registros de entrada/saída\n"
            "- o vínculo com responsável\n"
            "- a foto principal no Supabase Storage\n"
            "- a pasta local de fotos"
        )

        if not confirmar:
            return

        ok, mensagem = excluir_aluno(aluno_id)

        if ok:
            messagebox.showinfo("Sucesso", mensagem)
            self.excluir_id_var.set("")
        else:
            messagebox.showerror("Erro", mensagem)

    def limpar_campos(self):
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

    