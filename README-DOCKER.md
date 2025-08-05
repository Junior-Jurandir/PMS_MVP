# Guia de Desenvolvimento com Docker - PMS-MVP

Este documento fornece instruções completas para configurar e executar o ambiente de desenvolvimento do PMS-MVP usando Docker.

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Git (para clonar o repositório)
- 4GB+ de RAM disponível

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd PMS_MVP

# Copie o arquivo de ambiente
cp .env.example .env

# (Opcional) Ajuste as variáveis no .env conforme necessário
```

### 2. Iniciar o Ambiente de Desenvolvimento

```bash
# Opção 1: Iniciar todos os serviços
docker-compose up -d

# Opção 2: Ver logs em tempo real
docker-compose up

# Opção 3: Reconstruir imagens após mudanças
docker-compose up --build
```

### 3. Verificar Status dos Serviços

```bash
# Verificar se todos os containers estão rodando
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs nextjs
docker-compose logs postgres
```

## 🛠️ Comandos Úteis

### Desenvolvimento Diário

```bash
# Iniciar ambiente
docker-compose up -d

# Parar ambiente
docker-compose down

# Limpar volumes (cuidado: apaga dados!)
docker-compose down -v

# Ver logs
docker-compose logs -f nextjs

# Executar comandos dentro do container
docker-compose exec nextjs npm run lint
docker-compose exec nextjs npx prisma db push
```

### Manutenção

```bash
# Reconstruir imagens sem cache
docker-compose build --no-cache

# Atualizar dependências
docker-compose exec nextjs npm update

# Limpar imagens e containers não utilizados
docker system prune -a
```

## 📊 Acessos aos Serviços

| Serviço | URL Local | Porta | Descrição |
|---------|-----------|-------|-----------|
| Next.js App | http://localhost:3000 | 3000 | Aplicação principal |
| PostgreSQL | localhost:5432 | 5432 | Banco de dados |
| Prisma Studio | http://localhost:5555 | 5555 | Interface visual do banco |
| Redis | localhost:6379 | 6379 | Cache e sessões |

## 🔧 Comandos de Desenvolvimento

### Dentro do container Next.js

```bash
# Executar comandos dentro do container
docker-compose exec nextjs bash

# Comandos disponíveis dentro do container:
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Verifica estilo de código
npx prisma db push   # Aplica migrações
npx prisma studio    # Interface visual do banco
```

### Banco de Dados

```bash
# Acessar PostgreSQL via terminal
docker-compose exec postgres psql -U pms_user -d pms_development

# Executar seed (se disponível)
docker-compose exec nextjs npm run seed
```

## 🐳 Desenvolvimento com Docker

### Estrutura dos Containers

- **nextjs**: Next.js 14 com hot-reload
- **postgres**: PostgreSQL 15 com dados persistentes
- **redis**: Redis 7 para cache e sessões
- **prisma-studio**: Interface visual do Prisma

### Volumes e Persistência

- `postgres_data`: Persiste dados do PostgreSQL
- `redis_data`: Persiste dados do Redis
- Bind mounts: Sincroniza código-fonte em tempo real

### Hot Reload

O código-fonte é sincronizado automaticamente entre seu sistema de arquivos local e o container, permitindo hot-reload durante o desenvolvimento.

## 🚨 Solução de Problemas

### Portas já em uso

```bash
# Verificar portas em uso
lsof -i :3000
lsof -i :5432

# Parar serviços conflitantes ou usar portas alternativas
```

### Erros de permissão no Docker

```bash
# Linux/Mac: Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Windows: Executar Docker Desktop como administrador
```

### Limpar cache do Docker

```bash
# Limpar containers e imagens não utilizadas
docker system prune -a

# Limpar volumes (cuidado: apaga dados!)
docker volume prune
```

### Reconstruir completamente

```bash
# Limpar tudo e reconstruir
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Configuração de IDE

### VS Code

Instale as extensões recomendadas:
- Docker
- Prisma
- PostgreSQL
- ESLint
- Prettier

### Configuração de debugging

```json
// .vscode/settings.json
{
  "docker.environment": {
    "DATABASE_URL": "postgresql://pms_user:pms_password@localhost:5432/pms_development"
  }
}
```

## 🔄 Integração com Git

### Ignorar arquivos gerados

O `.gitignore` já está configurado para ignorar:
- Arquivos de build
- Dependências do Docker
- Arquivos de ambiente
- Logs e cache

### Hooks de pre-commit

```bash
# Executar lint antes de commitar
docker-compose exec nextjs npm run lint
```

## 📞 Suporte

Para problemas com o ambiente Docker:
1. Verifique os logs com `docker-compose logs`
2. Consulte a documentação oficial do Docker
3. Abra uma issue no repositório com detalhes do erro

## 🎯 Próximos Passos

Após o ambiente estar funcionando:
1. Acesse http://localhost:3000
2. Configure o banco de dados inicial
3. Explore o Prisma Studio em http://localhost:5555
4. Comece a desenvolver suas features!
