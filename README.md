# ☕ Cafe Online

Aplicação web desenvolvida com **React + Vite**, utilizando componentes
em **JavaScript (JSX)**.

O projeto foi estruturado para evoluir gradualmente para uma arquitetura
em nuvem utilizando **Microsoft Azure**, permitindo crescimento
organizado e escalável.

------------------------------------------------------------------------

# 📦 Estrutura do Repositório

    cafe-online
    │
    ├── frontend            # Aplicação React (biblioteca do Java)
    │
    ├── backend             # API futura (Node.js ou .Net)
    │
    ├── database            # Scripts e estrutura do banco (postgree)
    │
    ├── docs                # Documentação do projeto
    │
    ├── .github/workflows   # CI/CD (deploy automático)
    │
    └── README.md

------------------------------------------------------------------------

# 🧩 Estrutura do Frontend

    src
    ├── components      # Componentes reutilizáveis
    ├── i18n            # Internacionalização
    ├── lib             # Funções utilitárias
    ├── pages           # Páginas da aplicação
    │
    ├── App.jsx         # Configuração das rotas
    ├── main.jsx        # Inicialização do React
    └── index.css       # Estilos globais

Fluxo da aplicação:

    index.html
       │
       ▼
    main.jsx → Inicializa o React
       │
       ▼
    App.jsx → Configuração das rotas
       │
       ▼
    pages / components

------------------------------------------------------------------------

# 🚀 Tecnologias Utilizadas

-   React
-   Vite (para rodar o projeto)
-   React Router
-   JavaScript (JSX)
-   CSS (arquivo de estilo, formatações, designer...)

------------------------------------------------------------------------

# ⚙️ Executando o Projeto

Instalar dependências:

``` bash
npm install
```

Executar em modo desenvolvimento:

``` bash
npm run dev
```

Aplicação disponível em:

    http://localhost:5173

------------------------------------------------------------------------

# 📦 Build de Produção (vou cirar uma ambiente de Homologação e um Produção)

Gerar build otimizado:

``` bash
npm run build
```

Os arquivos serão gerados em:

    dist/

------------------------------------------------------------------------

# ☁️ Arquitetura na Nuvem (Azure)

O projeto foi planejado para evoluir em etapas dentro da **Microsoft
Azure**.

------------------------------------------------------------------------

# Fase 1 --- Frontend

Publicação do **React + Vite** no **Azure Static Web Apps**.

Arquitetura:

    Usuário (navegador ou celular)
       │
       ▼
    Azure Static Web Apps

Vantagens:

-   Hospedagem gratuita para projetos pequenos
-   Deploy automático via Git
------------------------------------------------------------------------

# Fase 2 --- Frontend + API

Quando o sistema precisar de backend (cadastro, autenticação, regras de
negócio), será adicionada uma API.

Arquitetura:

    Usuário
       │
       ▼
    Azure Static Web Apps (Frontend)
       │
       ▼
    API (Azure App Service ouuuuuuuuu Container Apps (estou pensando mais netes))

Backend possível:

-   Node.js ouuuuu  .NET

------------------------------------------------------------------------

# Fase 3 --- Sistema Completo

Com o crescimento da aplicação, será incluído banco de dados e
integrações.

Arquitetura recomendada:

    Usuário
       │
       ▼
    Azure Static Web Apps (Frontend)
       │
       ▼
    API (Azure App Service / Container Apps)
       │
       ▼
    Banco de Dados
    ├─ PostgreSQL

Possíveis evoluções:

-   Autenticação
-   Upload de arquivos (estara preparado...)
-   Integração com APIs externas (talvez futuramente será preciso, como ver o cotação do dolar....)
-   Monitoramento e logs (muito importante para verificar erros de produção, ainda mais quando não e possivel simular no Homologação)
-   CI/CD automático (integrar (alteração) e entregar ou seja, subir uma alteração automaticamente...)

------------------------------------------------------------------------

# 📈 Evolução do Projeto

Caminho recomendado de evolução:

1.  Publicar apenas o **frontend**
2.  Criar **API separada**
3.  Integrar **banco de dados**
4.  Automatizar **deploy e infraestrutura**

Essa estratégia permite que o projeto cresça de forma organizada e
escalável.
