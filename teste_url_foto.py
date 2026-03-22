from database import obter_url_assinada_foto

# troque pelo caminho real salvo no banco
foto_path = "alunos/16/principal.jpg"

url = obter_url_assinada_foto(foto_path, 300)
print(url)