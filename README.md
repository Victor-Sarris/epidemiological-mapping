# 🗺️ Mapeamento Epidemiológico - Floriano, PI

Este é o repositório do **Sistema de Mapeamento Epidemiológico**, uma plataforma de inteligência em saúde pública desenvolvida para a cidade de Floriano, Piauí. O objetivo principal é acompanhar a evolução de casos, identificar zonas de calor e gerenciar a cobertura territorial utilizando as Unidades Básicas de Saúde (UBSs) como pontos de referência para divisão de quadrantes.

## 🚀 Tecnologias Utilizadas

O projeto adota uma arquitetura moderna, separando completamente as responsabilidades do cliente e do servidor:

- **Frontend:**
  - Interface web SPA (Single Page Application) construída com React e Vite.
  - Estilização ágil utilizando Tailwind CSS (`index.css`).
  - Componentes modulares via Shadcn UI (configurados em `components.json` e na pasta `ui/`).
  - Renderização de mapas interativos utilizando MapLibre GL JS e OpenFreeMap (`ui/map.jsx`)[cite: 8].
- **Backend:**
  - API RESTful desenvolvida em Python com o framework Django e Django REST Framework (`backend/api/`)[cite: 8].
  - Integração planejada com PostgreSQL e a extensão PostGIS para o processamento de polígonos, quadrantes e cálculos geoespaciais avançados.

## 📂 Estrutura do Projeto

A base de código está organizada em duas pastas fundamentais[cite: 8]:

- **`backend/`**: Contém toda a lógica de negócio, modelos de banco de dados e endpoints da API[cite: 8].
  - `api/`: Configurações principais do ambiente Django (`settings.py`, `urls.py`) e regras de serialização de dados (`serializers.py`)[cite: 8].
  - `manage.py`: Script principal para execução e gerenciamento do servidor backend[cite: 8].
- **`frontend/`**: Contém a aplicação web que interage com os usuários[cite: 8].
  - `src/pages/`: Telas e visões do sistema, englobando rotas como `Home.jsx` e o mapa principal em `EpidemiologicMap.jsx`[cite: 8].
  - `src/components/`: Componentes visuais reutilizáveis, incluindo a `Sidebar.jsx` e elementos padronizados do Shadcn na subpasta `ui/`[cite: 8].
  - `src/assets/`: Recursos estáticos, como SVGs e imagens da interface[cite: 8].
  - `Configurações`: Arquivos como `vite.config.js`, `package.json` e `jsconfig.json` gerenciam as dependências e atalhos de caminho da aplicação[cite: 8].

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (v18 ou superior)
- Python (3.10 ou superior)
- PostgreSQL + PostGIS (Recomendado para o ambiente de dados espaciais)

### Iniciando o Frontend

1. Navegue até a pasta do cliente:
   ```bash
   cd frontend
   ```
