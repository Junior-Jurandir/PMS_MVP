# Guia de Desenvolvimento - PMS

Este documento contém informações técnicas detalhadas para desenvolvedores que trabalharão no projeto PMS.

## 🏗️ Arquitetura da Aplicação

### Padrões Arquiteturais

- **App Router**: Utiliza o novo App Router do Next.js 13+
- **Server Components**: Componentes renderizados no servidor por padrão
- **Client Components**: Marcados com `'use client'` quando necessário
- **API Routes**: Para endpoints de backend (a serem implementados)

### Estrutura de Pastas Detalhada

```
app/
├── app/                           # App Router
│   ├── (auth)/                   # Route Groups para autenticação
│   │   └── login/                # Página de login
│   ├── (dashboard)/              # Route Groups para área logada
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── quartos/              # Gestão de quartos
│   │   ├── hospedes/             # Gestão de hóspedes
│   │   └── reservas/             # Gestão de reservas
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints de autenticação
│   │   ├── rooms/                # CRUD de quartos
│   │   ├── guests/               # CRUD de hóspedes
│   │   └── reservations/         # CRUD de reservas
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Página inicial
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── forms/                    # Componentes de formulário
│   ├── charts/                   # Componentes de gráficos
│   └── layout/                   # Componentes de layout
├── lib/                          # Utilitários e configurações
│   ├── validations/              # Schemas de validação Zod
│   ├── hooks/                    # Custom hooks
│   └── constants/                # Constantes da aplicação
└── types/                        # Definições de tipos globais
```

## 🔧 Configuração do Ambiente de Desenvolvimento

### 1. Pré-requisitos

```bash
# Node.js (versão 18+)
node --version

# PostgreSQL (versão 12+)
psql --version

# Git
git --version
```

### 2. Setup Inicial

```bash
# Clone o repositório
git clone <repository-url>
cd app

# Instale as dependências
npm install

# Configure o banco de dados local
createdb pms_development

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### 3. Configuração do .env.local

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pms_development"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key"

# Development
NODE_ENV="development"
NEXT_TELEMETRY_DISABLED=1
```

### 4. Inicialização do Banco

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar schema ao banco
npx prisma db push

# (Opcional) Executar seed
npm run seed

# Visualizar dados no Prisma Studio
npx prisma studio
```

## 📋 Convenções de Código

### Nomenclatura

```typescript
// Componentes: PascalCase
export function UserProfile() {}

// Hooks: camelCase com prefixo 'use'
export function useUserData() {}

// Utilitários: camelCase
export function formatCurrency() {}

// Constantes: UPPER_SNAKE_CASE
export const API_ENDPOINTS = {}

// Tipos/Interfaces: PascalCase
export interface UserData {}
export type ReservationStatus = 'confirmed' | 'cancelled'
```

### Estrutura de Componentes

```typescript
'use client' // Se necessário

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface ComponentProps {
  title: string
  onSubmit: (data: FormData) => void
}

export function Component({ title, onSubmit }: ComponentProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await onSubmit(data)
      toast({
        title: "Sucesso",
        description: "Operação realizada com sucesso"
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro na operação",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {/* Conteúdo do componente */}
    </div>
  )
}
```

### Validação com Zod

```typescript
// lib/validations/room.ts
import { z } from 'zod'

export const roomSchema = z.object({
  number: z.string().min(1, 'Número do quarto é obrigatório'),
  name: z.string().min(1, 'Nome do quarto é obrigatório'),
  type: z.enum(['SOLTEIRO', 'CASAL', 'SUITE', 'FAMILIA', 'PRESIDENCIAL']),
  capacity: z.number().min(1, 'Capacidade deve ser maior que 0'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional()
})

export type RoomFormData = z.infer<typeof roomSchema>
```

## 🎨 Sistema de Design

### Cores e Temas

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... outras variáveis CSS */
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... variáveis para tema escuro */
}
```

### Componentes UI

```typescript
// Exemplo de uso dos componentes UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ExampleForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulário de Exemplo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Digite algo..." />
        <Button type="submit">Enviar</Button>
      </CardContent>
    </Card>
  )
}
```

## 🔌 API Routes

### Estrutura Padrão

```typescript
// app/api/rooms/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { roomSchema } from '@/lib/validations/room'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rooms = await prisma.room.findMany({
      orderBy: { number: 'asc' }
    })

    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = roomSchema.parse(body)

    const room = await prisma.room.create({
      data: validatedData
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## 🗃️ Gerenciamento de Estado

### Zustand para Estado Global

```typescript
// lib/stores/reservation-store.ts
import { create } from 'zustand'
import { ReservationWithDetails } from '@/lib/types'

interface ReservationStore {
  reservations: ReservationWithDetails[]
  loading: boolean
  setReservations: (reservations: ReservationWithDetails[]) => void
  addReservation: (reservation: ReservationWithDetails) => void
  updateReservation: (id: string, data: Partial<ReservationWithDetails>) => void
  removeReservation: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  loading: false,
  setReservations: (reservations) => set({ reservations }),
  addReservation: (reservation) =>
    set((state) => ({ reservations: [...state.reservations, reservation] })),
  updateReservation: (id, data) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, ...data } : r
      )
    })),
  removeReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((r) => r.id !== id)
    })),
  setLoading: (loading) => set({ loading })
}))
```

### React Query para Cache de Dados

```typescript
// lib/hooks/use-rooms.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Room } from '@prisma/client'

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async (): Promise<Room[]> => {
      const response = await fetch('/api/rooms')
      if (!response.ok) throw new Error('Failed to fetch rooms')
      return response.json()
    }
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: RoomFormData): Promise<Room> => {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create room')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    }
  })
}
```

## 🧪 Testes

### Configuração do Jest

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### Exemplo de Teste

```typescript
// __tests__/components/room-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RoomForm } from '@/components/forms/room-form'

describe('RoomForm', () => {
  it('should render form fields', () => {
    render(<RoomForm onSubmit={jest.fn()} />)
    
    expect(screen.getByLabelText(/número do quarto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nome do quarto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const onSubmit = jest.fn()
    render(<RoomForm onSubmit={onSubmit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/número do quarto é obrigatório/i)).toBeInTheDocument()
    })
    
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
```

## 📊 Performance e Otimização

### Lazy Loading de Componentes

```typescript
import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ReservationChart = lazy(() => import('@/components/charts/reservation-chart'))

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ReservationChart />
      </Suspense>
    </div>
  )
}
```

### Otimização de Imagens

```typescript
import Image from 'next/image'

export function RoomImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      className="rounded-lg object-cover"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

## 🔍 Debugging

### Configuração do VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Logs Estruturados

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }))
  },
  error: (message: string, error?: Error, meta?: object) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error?.message, 
      stack: error?.stack,
      ...meta, 
      timestamp: new Date().toISOString() 
    }))
  }
}
```

## 🚀 Scripts de Desenvolvimento

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx --require dotenv/config scripts/seed.ts",
    "db:reset": "prisma db push --force-reset && npm run db:seed"
  }
}
```

## 📝 Checklist de Desenvolvimento

### Antes de Commitar

- [ ] Código formatado com Prettier
- [ ] Sem erros de ESLint
- [ ] Tipos TypeScript corretos
- [ ] Testes passando
- [ ] Componentes documentados
- [ ] Performance verificada

### Antes de Deploy

- [ ] Build funcionando
- [ ] Migrações de banco testadas
- [ ] Variáveis de ambiente configuradas
- [ ] Testes de integração passando
- [ ] Logs de erro configurados

## 🤝 Contribuição

### Fluxo de Trabalho

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
4. **Desenvolva** seguindo as convenções
5. **Teste** suas mudanças
6. **Commit** com mensagens descritivas
7. **Push** para seu fork
8. **Abra** um Pull Request

### Mensagens de Commit

```
feat: adiciona funcionalidade de check-in automático
fix: corrige cálculo de taxa de ocupação
docs: atualiza documentação da API
style: ajusta espaçamento dos componentes
refactor: reorganiza estrutura de pastas
test: adiciona testes para reservas
chore: atualiza dependências
```

---

Este guia deve ser atualizado conforme o projeto evolui. Para dúvidas específicas, consulte a documentação das tecnologias utilizadas ou abra uma issue no repositório.