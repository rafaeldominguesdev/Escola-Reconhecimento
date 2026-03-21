import cv2  # type: ignore
import os
import time
from datetime import datetime

import face_recognition  # type: ignore
import numpy as np  # type: ignore

from database import (  # type: ignore
    criar_tabelas,
    buscar_aluno_por_id,
    buscar_ultimo_registro,
    registrar_ponto
)


def carregar_encodings_do_banco():
    """
    Percorre a pasta 'fotos', processa cada imagem com a biblioteca face_recognition
    e guarda os traços matemáticos de cada rosto atrelados ao seu respectivo ID.
    """
    encodings_conhecidos = []
    ids_conhecidos = []
    pasta_base = "fotos"

    if not os.path.exists(pasta_base):
        print("Pasta de fotos não encontrada. Nenhum rosto cadastrado.")
        return encodings_conhecidos, ids_conhecidos

    print("Carregando rostos do banco de dados. Isso pode demorar alguns segundos...")

    for nome_pasta in os.listdir(pasta_base):
        caminho_pasta_aluno = os.path.join(pasta_base, nome_pasta)

        if os.path.isdir(caminho_pasta_aluno) and nome_pasta.startswith("aluno_"):
            try:
                id_aluno = int(nome_pasta.split("_")[1])
            except ValueError:
                continue

            for nome_arquivo in os.listdir(caminho_pasta_aluno):
                caminho_imagem = os.path.join(caminho_pasta_aluno, nome_arquivo)

                try:
                    imagem = face_recognition.load_image_file(caminho_imagem)
                    encodings_da_imagem = face_recognition.face_encodings(imagem)

                    if len(encodings_da_imagem) > 0:
                        encodings_conhecidos.append(encodings_da_imagem[0])
                        ids_conhecidos.append(id_aluno)
                except Exception as e:
                    print(f"Erro ao analisar a foto {caminho_imagem}: {e}")

    print(f"Carregamento completo! Foram montadas {len(encodings_conhecidos)} amostras faciais.")
    return encodings_conhecidos, ids_conhecidos


def iniciar_reconhecimento():
    """
    Ativa a webcam em tempo real, capta os rostos presentes nela e checa
    no banco de dados (SQLite) as informações detalhadas de quem ele identificou.
    """
    criar_tabelas()
    controle_tempo = {}

    encodings_conhecidos, ids_conhecidos = carregar_encodings_do_banco()

    if not encodings_conhecidos:
        print("ALERTA: Lista de rostos vazia. O reconhecimento retornará 'Desconhecido' sempre.")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Erro Crítico: Não foi possível conectar a webcam.")
        return

    print("Câmera online. (Pressione 'q' na janela para fechar e interromper)")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Falha ao receber pacotes de imagem da câmera.")
            break

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = np.ascontiguousarray(small_frame[:, :, ::-1])

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            id_encontrado = None

            if encodings_conhecidos:
                matches = face_recognition.compare_faces(
                    encodings_conhecidos,
                    face_encoding,
                    tolerance=0.6
                )
                face_distances = face_recognition.face_distance(encodings_conhecidos, face_encoding)

                if len(face_distances) > 0:
                    best_match_index = int(np.argmin(face_distances))
                    if matches[best_match_index]:
                        id_encontrado = ids_conhecidos[best_match_index]  # type: ignore

            texto_exibicao = "Desconhecido"
            cor_caixa = (0, 0, 255)

            if id_encontrado is not None:
                dados_aluno = buscar_aluno_por_id(id_encontrado)

                if dados_aluno:
                    nome, turma, numero_chamada = dados_aluno
                    texto_exibicao = f"{nome} - Turma {turma} (Nº {numero_chamada})"
                    cor_caixa = (0, 255, 0)

                    tempo_atual = time.time()

                    if (
                        id_encontrado not in controle_tempo
                        or (tempo_atual - controle_tempo[id_encontrado]) > 30  # type: ignore
                    ):
                        agora = datetime.now()
                        data_atual = agora.strftime("%Y-%m-%d")
                        hora_atual = agora.strftime("%H:%M:%S")

                        ultimo_tipo = buscar_ultimo_registro(id_encontrado, data_atual)

                        if ultimo_tipo is None or ultimo_tipo == "SAIDA":
                            novo_tipo = "ENTRADA"
                        else:
                            novo_tipo = "SAIDA"

                        registrar_ponto(id_encontrado, data_atual, hora_atual, novo_tipo)
                        controle_tempo[id_encontrado] = tempo_atual

                        print(f"[{hora_atual}] REGISTRO: {nome} marcou {novo_tipo}.")

            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            cv2.rectangle(frame, (left, top), (right, bottom), cor_caixa, 2)
            cv2.rectangle(frame, (left, bottom - 30), (right, bottom), cor_caixa, cv2.FILLED)

            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, texto_exibicao, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)

        cv2.imshow("Sistema Escolar - Reconhecimento Facial", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    iniciar_reconhecimento()