# To-Do List Frontend

Uma aplicação de lista de tarefas desenvolvida em React com TypeScript e Material-UI.

## O que é

Uma interface web simples para gerenciar suas tarefas diárias. Permite:

- ✅ Criar novas tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Excluir tarefas
- ✅ Filtrar por status (todas, pendentes, concluídas)

## Tecnologias

- React 19
- TypeScript
- Material-UI
- Vite
- Docker

## Como rodar

### Pré-requisitos

- Docker instalado

### 1. Clone o repositório

```bash
git clone https://github.com/arthur-hc/to-do-list-frontend.git
cd to-do-list-frontend/to-do-list-frontend
```

### 2. Rode com Docker

```bash
docker-compose up
```

### 3. Acesse a aplicação

Abra seu navegador em: http://localhost:5173

## API Backend

Esta aplicação consome a API do backend disponível em:
https://github.com/arthur-hc/to-do-list-backend

**Importante:** Certifique-se de que a API backend esteja rodando na porta 3000 antes de usar a aplicação.

## Comandos úteis

```bash
# Parar a aplicação
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild (se necessário)
docker-compose build --no-cache
```

## Estrutura do projeto

```
to-do-list-frontend/
├── src/
│   ├── components/
│   │   ├── TodoList.tsx      # Componente principal
│   │   └── MyToast.tsx       # Sistema de notificações
│   ├── services/
│   │   └── api.ts           # Configuração da API
│   └── main.tsx             # Ponto de entrada
├── docker-compose.yml       # Configuração Docker
└── package.json            # Dependências
```

---
