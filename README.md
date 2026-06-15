# ☕ Café Online

Plataforma web para comercialização de café entre produtores, compradores e equipe comercial.

## Objetivo

O Café Online é uma plataforma voltada para a comercialização de café entre produtores, compradores e equipe comercial.

O sistema permite o cadastro e negociação de lotes de café, facilitando a conexão entre produtores rurais e compradores nacionais e internacionais.

O projeto foi concebido para crescer de forma modular, permitindo futuras integrações com logística, exportação, documentos, câmbio e rastreabilidade dos lotes.

---

# 📦 Estrutura do Repositório

    cafe-online
    │
    ├── frontend            # Aplicação React + Vite
    ├── backend             # API .NET 8 Web API
    ├── database            # Scripts e estrutura do banco PostgreSQL
    ├── docs                # Documentação do projeto
    ├── .github/workflows   # CI/CD
    └── README.md

---

# 🚀 Tecnologias Utilizadas

## Frontend
- React
- Vite
- React Router DOM
- JavaScript (ES6+)
- CSS

## Backend
- .NET 8 Web API
- Entity Framework Core
- JWT Authentication (futuro)

## Banco de Dados
- PostgreSQL

## Cloud
- Azure Static Web Apps
- Azure Container Apps
- Azure Database for PostgreSQL

---

# 🔐 Controle de Acesso

O sistema utiliza controle de acesso baseado em perfis de usuário.

## Perfis Disponíveis

### Administrador
Login: admin@cafeonline.com

Permissões:
- Dashboard
- Cadastros
- Usuários
- Produtores
- Compradores
- Lotes
- Compras
- Vendas
- Relatórios
- Configurações

### Produtor
Login: produtor@cafeonline.com

Permissões:
- Dashboard
- Cadastros
- Meus Lotes
- Cadastrar Lote
- Minhas Vendas
- Documentos
- Meu Perfil

### Comercial
Login: comercial@cafeonline.com

Permissões:
- Dashboard Comercial
- Clientes
- Lotes Disponíveis
- Negociações
- Vendas

### Comprador
Login: comprador@cafeonline.com

Permissões:
- Dashboard
- Comprar Café
- Catálogo de Lotes
- Meus Pedidos
- Documentos
- Meu Perfil

---

## Matriz de Permissões

| Perfil | Cadastros | Lotes | Compras | Vendas | Configurações |
|---------|---------|---------|---------|---------|---------|
| Administrador | ✅ | ✅ | ✅ | ✅ | ✅ |
| Produtor | ✅ | ✅ | ❌ | ✅ | ❌ |
| Comercial | ❌ | Visualizar | ❌ | ✅ | ❌ |
| Comprador | ❌ | Visualizar | ✅ | ❌ | ❌ |

---

## Regras de Navegação

A aba **Cadastros** é exibida apenas para:
- Administrador
- Produtor

Sem acesso:
- Comercial
- Comprador

---

## Usuários de Teste

| Perfil | Login |
|---------|---------|
| Administrador | admin@cafeonline.com |
| Produtor | produtor@cafeonline.com |
| Comercial | comercial@cafeonline.com |
| Comprador | comprador@cafeonline.com |

Senha padrão:

    cafe2026

> Estes usuários existem apenas para testes durante o desenvolvimento. Em produção os usuários serão cadastrados e gerenciados pelo Administrador.

---

# ☁️ Arquitetura Azure

## Fase 1
- Frontend em Azure Static Web Apps

## Fase 2
- Frontend + API .NET 8 em Azure Container Apps

## Fase 3
- PostgreSQL
- Monitoramento
- CI/CD
- Integrações externas

---

# 📈 Evoluções Futuras

- Cadastro dinâmico de usuários
- Recuperação de senha
- Autenticação JWT
- Controle granular de permissões
- Auditoria de acessos
- Perfis de Corretor
- Perfis de Exportador
- Perfis de Cooperativa
- Perfis de Classificador de Café
