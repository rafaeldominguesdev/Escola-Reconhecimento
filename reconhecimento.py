import cv2
import os
import face_recognition
import numpy as np
from database import buscar_aluno_por_id

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
    
    # 1. Explorar todos os diretórios dentro da pasta base (ex: fotos/aluno_1)
    for nome_pasta in os.listdir(pasta_base):
        caminho_pasta_aluno = os.path.join(pasta_base, nome_pasta)
        
        if os.path.isdir(caminho_pasta_aluno) and nome_pasta.startswith("aluno_"):
            
            # 2. Extrair exatamente o ID numérico da pasta
            try:
                id_aluno = int(nome_pasta.split("_")[1])
            except ValueError:
                continue # Pula se não for possível converter o ID

            # 3. Ler todas as fotos (1.jpg, 2.jpg) dentro do aluno
            for nome_arquivo in os.listdir(caminho_pasta_aluno):
                caminho_imagem = os.path.join(caminho_pasta_aluno, nome_arquivo)
                
                try:
                    # O face_recognition tem o seu próprio leitor de imagem
                    imagem = face_recognition.load_image_file(caminho_imagem)
                    
                    # Converte a imagem em um "encoding" (uma lista de 128 números descrevendo o rosto)
                    encodings_da_imagem = face_recognition.face_encodings(imagem)
                    
                    if len(encodings_da_imagem) > 0:
                        # Pega o rosto principal (índice 0)
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

        # Otimização 1: Diminuir o quadro a 1/4 do tamanho acelera infinitamente a rede neural
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        
        # Otimização 2: Corrigir esquema de cor. OpenCV processa BGR, Face_Recognition pede RGB.
        rgb_small_frame = np.ascontiguousarray(small_frame[:, :, ::-1])
        
        # Identifica ONDE há rostos na câmera, e então EXTRAI os marcadores matemáticos desses rostos
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        # Usamos o zip() para emparelhar cada caixinha/coordenada de rosto com sua respectiva matriz matemática
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            id_encontrado = None
            
            # Só faz comparação se realmente tem aluninhos carregados na memória
            if encodings_conhecidos:
                # Retorna os matches e o quão distante/confiável cada correspondência é (tolerance 0.5)
                matches = face_recognition.compare_faces(encodings_conhecidos, face_encoding, tolerance=0.5)
                face_distances = face_recognition.face_distance(encodings_conhecidos, face_encoding)
                
                if len(face_distances) > 0:
                    best_match_index = np.argmin(face_distances) # Pega o índice com a probabilidade mais forte
                    if matches[best_match_index]:
                        id_encontrado = ids_conhecidos[best_match_index] # Relaciona o index ao ID do Aluno!

            # Estética base do quadro (Desconhecido -> Caixa Vermelha)
            texto_exibicao = "Desconhecido"
            cor_caixa = (0, 0, 255)

            # Caso haja cruzamento de ID no sistema (Reconhecido!)
            if id_encontrado is not None:
                # REQUISITO: Buscar NOME + TURMA + CHAMADA diretamente no banco de dados
                dados_aluno = buscar_aluno_por_id(id_encontrado)
                
                if dados_aluno:
                    nome, turma, numero_chamada = dados_aluno
                    texto_exibicao = f"{nome} - {turma} n{numero_chamada}"
                    cor_caixa = (0, 255, 0) # Fica Verde!
            
            # Como compactamos o tamanho do vídeo para acelerar, temos que "restaurar" as matrizes em proporção 4x
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Desenha a moldura do rosto
            cv2.rectangle(frame, (left, top), (right, bottom), cor_caixa, 2)

            # Desenha um chapeuzinho na base pra pintar de cor sólida pro texto ler bem
            cv2.rectangle(frame, (left, bottom - 30), (right, bottom), cor_caixa, cv2.FILLED)
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, texto_exibicao, (left + 6, bottom - 6), font, 0.5, (255, 255, 255), 1)

        # Desenhar o resultado global do frame
        cv2.imshow("Sistema Escolar - Reconhecimento Facial", frame)

        # Escuta o teclado para o caractere 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Esvaziar a memória e desligar os recursos
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    iniciar_reconhecimento()
