# PMS - Property Management System

Sistema de gestão hoteleira completo desenvolvido com Next.js, React e TypeScript.

## 📋 Visão Geral

O PMS (Property Management System) é uma aplicação web moderna para gestão hoteleira que oferece funcionalidades completas para administração de hotéis, pousadas e estabelecimentos similares. O sistema permite gerenciar quartos, hóspedes, reservas e fornece um dashboard com métricas importantes do negócio.

## 🚀 Funcionalidades Principais

### 🏨 Gestão de Quartos
- Cadastro e edição de quartos
- Diferentes tipos de quarto (Solteiro, Casal, Suíte, Família, Presidencial)
- Controle de status (Disponível, Ocupado, Manutenção, Limpeza, Indisponível)
- Definição de capacidade, preços e comodidades
- Visualização em tempo real da ocupação

### 👥 Gestão de Hóspedes
- Cadastro completo de hóspedes
- Informações pessoais e de contato
- Documentação (CPF, RG, Passaporte)
- Endereço completo e dados de emergência
- Histórico de estadias

### 📅 Sistema de Reservas
- Criação e gerenciamento de reservas
- Controle de check-in e check-out
- Status de reserva (Confirmada, Check-in, Check-out, Cancelada, No-show)
- Gestão de pagamentos (Pendente, Parcial, Pago, Reembolsado)
- Solicitações especiais e observações

### 📊 Dashboard Analítico
- Métricas em tempo real
- Taxa de ocupação
- Receita total
- Check-ins e check-outs do dia
- Quartos disponíveis vs ocupados
- Estatísticas de reservas

### 🔐 Sistema de Autenticação
- Login seguro com NextAuth.js
- Controle de acesso baseado em roles
- Dois níveis de usuário: Administrador e Recepcionista
- Sessões JWT seguras

### 🎨 Interface Moderna
- Design responsivo para desktop e mobile
- Tema claro/escuro
- Componentes UI modernos com Radix UI
- Navegação intuitiva
- Notificações toast

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes UI acessíveis
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend & Database
- **Prisma** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação
- **bcryptjs** - Hash de senhas

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript** - Verificação de tipos

## 📁 Estrutura do Projeto

```
app/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes (vazio - para futuras implementações)
│   ├── dashboard/         # Página do dashboard (vazio - implementação futura)
│   ├── hospedes/          # Páginas de gestão de hóspedes (vazio)
│   ├── login/             # Página de login (vazio - implementação futura)
│   ├── quartos/           # Páginas de gestão de quartos (vazio)
│   ├── reservas/          # Páginas de gestão de reservas (vazio)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal da aplicação
│   └── page.tsx           # Página inicial (redireciona para dashboard)
├── components/            # Componentes React reutilizáveis
│   ├── ui/                # Componentes UI base (vazio - para shadcn/ui)
│   ├── header.tsx         # Componente de cabeçalho/navegação
│   ├── providers.tsx      # Providers globais (Session, Theme, Toast)
│   └── theme-provider.tsx # Provider de tema claro/escuro
├── hooks/                 # Custom hooks
│   └── use-toast.ts       # Hook para notificações toast
├── lib/                   # Utilitários e configurações
│   ├── auth.ts            # Configuração do NextAuth.js
│   ├── db.ts              # Configuração do Prisma Client
│   ├── types.ts           # Definições de tipos TypeScript
│   └── utils.ts           # Funções utilitárias
├── prisma/                # Configuração do banco de dados
│   └── schema.prisma      # Schema do banco de dados
├── middleware.ts          # Middleware de autenticação
├── next.config.js         # Configuração do Next.js
├── package.json           # Dependências e scripts
└── components.json        # Configuração do shadcn/ui
```

## 🗄️ Modelo de Dados

### Entidades Principais

#### User (Usuários)
- Informações básicas (nome, email, senha)
- Sistema de roles (Administrador, Recepcionista)
- Status ativo/inativo
- Integração com NextAuth.js

#### Room (Quartos)
- Número e nome do quarto
- Tipo (Solteiro, Casal, Suíte, Família, Presidencial)
- Capacidade e preço
- Status atual
- Comodidades disponíveis

#### Guest (Hóspedes)
- Dados pessoais completos
- Documentação e nacionalidade
- Endereço e contatos
- Informações de emergência

#### Reservation (Reservas)
- Datas de check-in e check-out
- Número de adultos e crianças
- Preço total e status de pagamento
- Canal de reserva e observações
- Relacionamento com hóspede e quarto

## 🚀 Guia de Deploy

### Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **PostgreSQL** (versão 12 ou superior)
3. **Git**
4. **Conta em serviço de hospedagem** (Vercel, Railway, DigitalOcean, etc.)

### 1. Preparação do Ambiente

#### Clone o repositório:
```bash
git clone <url-do-repositorio>
cd app
```

#### Instale as dependências:
```bash
npm install
```

### 2. Configuração do Banco de Dados

#### Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pms_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"

# Opcional: Para produção
NODE_ENV="production"
```

#### Execute as migrações do Prisma:
```bash
npx prisma generate
npx prisma db push
```

#### (Opcional) Execute o seed para dados iniciais:
```bash
npm run seed
```

### 3. Deploy em Diferentes Plataformas

#### 🔷 Vercel (Recomendado)

1. **Conecte seu repositório:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório do GitHub

2. **Configure as variáveis de ambiente:**
   - No dashboard da Vercel, vá em Settings > Environment Variables
   - Adicione todas as variáveis do arquivo `.env`

3. **Configure o banco de dados:**
   - Use um serviço como Neon, Supabase ou Railway para PostgreSQL
   - Atualize a `DATABASE_URL` com a URL do banco em produção

4. **Deploy automático:**
   - A Vercel fará o deploy automaticamente a cada push

#### 🔷 Railway

1. **Crie um novo projeto:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Configure o banco de dados:**
   ```bash
   railway add postgresql
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   railway variables set NEXTAUTH_SECRET="seu-secret"
   railway variables set NEXTAUTH_URL="https://seu-app.railway.app"
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

#### 🔷 DigitalOcean App Platform

1. **Crie um novo app:**
   - Conecte seu repositório GitHub
   - Selecione o branch principal

2. **Configure o build:**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Configure as variáveis de ambiente:**
   - Adicione todas as variáveis necessárias no painel

4. **Configure o banco de dados:**
   - Use o DigitalOcean Managed Database para PostgreSQL

#### 🔷 Docker (Para qualquer provedor)

Crie um `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 4. Configurações de Produção

#### Otimizações de Performance:
```javascript
// next.config.js
const nextConfig = {
  // ... configurações existentes
  
  // Para produção
  compress: true,
  poweredByHeader: false,
  
  // Otimização de imagens
  images: {
    domains: ['seu-dominio.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

#### Configuração de SSL:
- Configure certificados SSL no seu provedor
- Atualize `NEXTAUTH_URL` para usar HTTPS
- Configure redirects HTTP → HTTPS

### 5. Monitoramento e Manutenção

#### Logs e Monitoramento:
- Configure logs de aplicação
- Use ferramentas como Sentry para error tracking
- Configure alertas de uptime

#### Backup do Banco de Dados:
```bash
# Backup automático (configure no cron)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Atualizações:
```bash
# Atualize dependências regularmente
npm update
npm audit fix

# Execute migrações em produção
npx prisma db push
```

### 6. Variáveis de Ambiente Essenciais

```env
# Banco de Dados
DATABASE_URL="postgresql://..."

# Autenticação
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="secret-super-seguro-de-32-caracteres"

# Opcional: Configurações adicionais
NODE_ENV="production"
NEXT_TELEMETRY_DISABLED=1
```

### 7. Checklist de Deploy

- [ ] Banco de dados configurado e acessível
- [ ] Variáveis de ambiente definidas
- [ ] Migrações do Prisma executadas
- [ ] Build da aplicação funcionando
- [ ] SSL configurado
- [ ] Domínio personalizado configurado
- [ ] Backup do banco configurado
- [ ] Monitoramento ativo
- [ ] Testes de funcionalidade realizados

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build e Produção
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Banco de Dados
npx prisma generate  # Gera cliente Prisma
npx prisma db push   # Aplica mudanças no schema
npx prisma studio    # Interface visual do banco

# Qualidade de Código
npm run lint         # Executa ESLint
```

## 📝 Próximos Passos

O projeto está estruturado para expansão. As próximas implementações podem incluir:

1. **Páginas de CRUD completas** para cada módulo
2. **API Routes** para operações do backend
3. **Relatórios e dashboards** avançados
4. **Sistema de notificações**
5. **Integração com sistemas de pagamento**
6. **App mobile** com React Native
7. **Sistema de housekeeping**
8. **Integração com canais de reserva** (Booking.com, Airbnb)

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato através dos canais oficiais do projeto.

---

**PMS - Property Management System** - Desenvolvido com ❤️ usando Next.js e React