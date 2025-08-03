# Guia de Deploy - PMS

Este documento contém instruções detalhadas para deploy da aplicação PMS em diferentes ambientes e plataformas.

## 🌐 Ambientes de Deploy

### 1. Desenvolvimento Local
- **URL**: http://localhost:3000
- **Banco**: PostgreSQL local
- **Propósito**: Desenvolvimento e testes

### 2. Staging/Homologação
- **URL**: https://pms-staging.exemplo.com
- **Banco**: PostgreSQL em nuvem
- **Propósito**: Testes de integração e validação

### 3. Produção
- **URL**: https://pms.exemplo.com
- **Banco**: PostgreSQL em nuvem (alta disponibilidade)
- **Propósito**: Ambiente de produção

## 🚀 Deploy na Vercel (Recomendado)

### Configuração Inicial

1. **Conectar Repositório**
   ```bash
   # Via CLI da Vercel
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Configurar Banco de Dados**
   
   Recomendamos usar **Neon** (PostgreSQL serverless):
   
   ```bash
   # Criar conta em neon.tech
   # Criar novo projeto
   # Copiar connection string
   ```

3. **Variáveis de Ambiente na Vercel**
   
   No dashboard da Vercel, configure:
   
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
   NEXTAUTH_URL=https://seu-app.vercel.app
   NEXTAUTH_SECRET=seu-secret-super-seguro-de-32-caracteres
   NODE_ENV=production
   ```

4. **Configurar Build Settings**
   
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "devCommand": "npm run dev"
   }
   ```

### Deploy Automático

```bash
# Configurar deploy automático
git push origin main  # Deploy automático na Vercel
```

### Comandos Úteis

```bash
# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Configurar domínio customizado
vercel domains add seu-dominio.com
```

## 🚂 Deploy no Railway

### Setup Inicial

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init
```

### Configuração do Banco

```bash
# Adicionar PostgreSQL
railway add postgresql

# Ver variáveis de ambiente
railway variables
```

### Configurar Variáveis

```bash
railway variables set NEXTAUTH_SECRET="seu-secret-aqui"
railway variables set NEXTAUTH_URL="https://seu-app.railway.app"
railway variables set NODE_ENV="production"
```

### Deploy

```bash
# Deploy
railway up

# Ver logs
railway logs

# Conectar domínio
railway domain
```

## 🌊 Deploy no DigitalOcean App Platform

### 1. Criar App via Interface Web

1. Acesse [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Clique em "Create App"
3. Conecte seu repositório GitHub
4. Configure as seguintes opções:

### 2. Configurações de Build

```yaml
# .do/app.yaml
name: pms-app
services:
- name: web
  source_dir: /
  github:
    repo: seu-usuario/seu-repo
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXTAUTH_URL
    value: ${APP_URL}
  - key: NEXTAUTH_SECRET
    value: ${NEXTAUTH_SECRET}
  - key: DATABASE_URL
    value: ${DATABASE_URL}

databases:
- name: pms-db
  engine: PG
  version: "13"
```

### 3. Configurar Banco de Dados

1. No painel, adicione um "Managed Database"
2. Escolha PostgreSQL
3. Configure o plano adequado
4. Conecte à aplicação

## 🐳 Deploy com Docker

### Dockerfile Otimizado

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências baseado no package manager preferido
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Desabilitar telemetria durante build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copiar arquivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose para Desenvolvimento

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/pms
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=development-secret
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=pms
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Comandos Docker

```bash
# Build da imagem
docker build -t pms-app .

# Executar com docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Executar migrações
docker-compose exec app npx prisma db push
```

## ☁️ Deploy na AWS (EC2 + RDS)

### 1. Configurar RDS (PostgreSQL)

```bash
# Via AWS CLI
aws rds create-db-instance \
  --db-instance-identifier pms-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password SuaSenhaSegura123 \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx
```

### 2. Configurar EC2

```bash
# Conectar à instância EC2
ssh -i sua-chave.pem ubuntu@ip-da-instancia

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositório
git clone https://github.com/seu-usuario/pms.git
cd pms

# Instalar dependências
npm install

# Configurar variáveis de ambiente
sudo nano .env.production
```

### 3. Configurar Nginx

```nginx
# /etc/nginx/sites-available/pms
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 5. Deploy com PM2

```bash
# Arquivo ecosystem.config.js
module.exports = {
  apps: [{
    name: 'pms-app',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Configurações de Produção

### Otimizações de Performance

```javascript
// next.config.js para produção
const nextConfig = {
  // Compressão
  compress: true,
  
  // Remover header X-Powered-By
  poweredByHeader: false,
  
  // Otimização de imagens
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
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
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  
  // Redirects HTTPS
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://seu-dominio.com/:path*',
        permanent: true,
      },
    ];
  },
};
```

### Configuração de Banco para Produção

```typescript
// lib/db.ts para produção
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 📊 Monitoramento e Logs

### Configurar Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### Logs Estruturados

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export { logger }
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Verificar conexão com banco
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Database connection failed'
      },
      { status: 503 }
    )
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      # Deploy para Vercel
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔐 Segurança

### Variáveis de Ambiente Seguras

```env
# Produção - usar valores seguros
NEXTAUTH_SECRET="chave-super-segura-de-32-caracteres-ou-mais"
DATABASE_URL="postgresql://user:senha@host:5432/db?sslmode=require"

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# CORS
ALLOWED_ORIGINS="https://seu-dominio.com,https://www.seu-dominio.com"
```

### Middleware de Segurança

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req: NextRequest) {
    // Rate limiting básico
    const ip = req.ip ?? '127.0.0.1'
    // Implementar rate limiting aqui
    
    // Headers de segurança
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/login') return true
        return !!token
      },
    },
  }
)
```

## 📋 Checklist de Deploy

### Pré-Deploy
- [ ] Testes passando
- [ ] Build funcionando localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] SSL configurado
- [ ] Domínio configurado

### Pós-Deploy
- [ ] Aplicação acessível
- [ ] Funcionalidades testadas
- [ ] Logs funcionando
- [ ] Monitoramento ativo
- [ ] Backup configurado
- [ ] Performance verificada

### Rollback Plan
- [ ] Backup do banco antes do deploy
- [ ] Versão anterior disponível
- [ ] Processo de rollback documentado
- [ ] Contatos de emergência definidos

## 🆘 Troubleshooting

### Problemas Comuns

1. **Build falha**
   ```bash
   # Verificar logs
   npm run build
   # Verificar tipos
   npm run type-check
   ```

2. **Erro de conexão com banco**
   ```bash
   # Testar conexão
   npx prisma db push --preview-feature
   ```

3. **Variáveis de ambiente**
   ```bash
   # Verificar se estão definidas
   echo $DATABASE_URL
   ```

4. **Problemas de SSL**
   ```bash
   # Verificar certificado
   openssl s_client -connect seu-dominio.com:443
   ```

### Logs Úteis

```bash
# Vercel
vercel logs --follow

# Railway
railway logs --follow

# Docker
docker logs -f container-name

# PM2
pm2 logs pms-app
```

---

Este guia deve ser atualizado conforme novas plataformas e práticas são adotadas. Para suporte específico, consulte a documentação da plataforma escolhida.