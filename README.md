# 🏫 Escola Modelo: Sistema de Reconhecimento Facial

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Uma solução completa e estatal para gestão escolar moderna, focada em segurança e automação através de Inteligência Artificial para reconhecimento facial. 

## 🚀 Visão Geral

O projeto **Escola Modelo** integra um painel administrativo intuitivo com um motor de reconhecimento facial em tempo real. Ele permite o controle de entrada e saída de alunos, gerenciamento de turmas, responsáveis e logs de presença, tudo conectado a um backend robusto em Supabase.

## ✨ Funcionalidades Principais

*   📸 **Reconhecimento Facial IA**: Identificação automática de alunos e registro instantâneo de presença via webcam.
*   📊 **Dashboard Administrativo**: Visão 360º de faturamentos, novos alunos e estatísticas diárias via gráficos interativos.
*   👥 **Gestão de Alunos & Responsáveis**: Cadastro completo com armazenamento de fotos para treinamento do modelo de IA.
*   📑 **Registros Históricos**: Histórico detalhado de todas as movimentações na escola com filtros por nível, ano e sala.
*   👤 **Perfil Overlay Premium**: Sistema de gerenciamento de conta via modal centralizado com design 1:1 "Square" moderno.
*   🌗 **Suporte a Temas**: Alternância dinâmica entre Light e Dark Mode para melhor conforto visual.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes**: [Shadcn UI](https://ui.shadcn.com/) / Lucide Icons / Recharts
- **Fonts**: Outfit (Branding) & Figtree (Content)

### Backend & IA
- **Linguagem**: [Python 3.12+](https://www.python.org/)
- **Visão Computacional**: OpenCV & `face_recognition`
- **Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL & Realtime)

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js v20.x ou superior
- Python 3.12.x ou superior
- Conta no Supabase

### 1. Configuração do Backend
```bash
cd backend
python -m venv venv
# Ative o venv (Windows: .\venv\Scripts\activate | Linux: source venv/bin/activate)
pip install -r requirements.txt
```
Configure o arquivo `.env` na pasta `backend`:
```env
SUPABASE_URL=seu_url
SUPABASE_KEY=sua_chave
```

### 2. Configuração do Frontend
```bash
cd frontend
npm install
```

## 🏁 Como Executar

Para iniciar ambos os serviços simultaneamente, use o script PowerShell na raiz ou o script npm dedicado:

**Via PowerShell:**
```powershell
./start-all.ps1
```

**Via NPM (recomendado):**
```bash
cd frontend
npm run dev:all
```

## 🎨 Design System
O projeto utiliza um design system focado em **Harmonia e Nitidez**, com micro-interações suaves, efeito de glassmorphism em modais e uma estética "Perfect UI" que prioriza a experiência do usuário administrador.

---
Desenvolvido com ❤️ por [Rafael Fernandes](https://github.com/rafaeldominguesdev)
