# EventOS — Painel do Organizador de Eventos

Dashboard para gerenciamento de eventos, participantes e regras de check-in. Construído com **Next.js 16**, **TypeScript**, **Tailwind CSS** e **shadcn/ui**.

> Versão de produção com arquitetura por features, TanStack Query, Server Actions, Zod e Playwright.

---

## 1. Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 18+           |
| npm        | 9+            |

---

## 2. Setup rápido

```bash
git clone <url-do-repositorio>
cd desafio-vlab
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). Você será redirecionado para a tela de login.

**Credenciais de teste:**

| Campo | Valor              |
|-------|-------------------|
| Email | admin@eventos.com  |
| Senha | 123456             |

---

## 3. Comandos disponíveis

| Comando                        | O que faz                                       |
|--------------------------------|-------------------------------------------------|
| `npm run dev`                  | Servidor de desenvolvimento (Turbopack)         |
| `npm run build`                | Build de produção                               |
| `npm run start`                | Roda o build de produção                        |
| `npm run lint`                 | Verifica com ESLint                             |
| `npm run test`                 | Testes unitários (Jest)                         |
| `npx playwright install`      | Instala os browsers do Playwright               |
| `npx playwright test`         | Testes E2E (Playwright)                         |
| `npx prettier --write .`      | Formata todo o código                           |

---

## 4. Testes

### 4.1 — Testes unitários (Jest)

```bash
npm run test
```

**2 suítes, 23 testes:**

| Arquivo                          | Testes | Cobertura                                                   |
|----------------------------------|--------|-------------------------------------------------------------|
| `validations.test.ts`            | 10     | Schemas Zod (evento, participante, login) — válidos e inválidos |
| `use-checkin-rules.test.ts`      | 13     | Lógica de validação de regras de check-in                   |

Cobrem: campos obrigatórios, email inválido, status inválido, regras ativas/inativas, janela zero, valores negativos, nomes duplicados, conflitos de janela entre regras obrigatórias.

### 4.2 — Testes E2E (Playwright)

```bash
npx playwright install   # primeira vez apenas
npx playwright test
```

**4 suítes, 14 testes:**

| Arquivo                | Testes | Cobertura                                        |
|------------------------|--------|--------------------------------------------------|
| `auth.spec.ts`         | 4      | Redirect, login, credenciais erradas, logout     |
| `events.spec.ts`       | 4      | Navegação, tabela, dialog, filtro de busca       |
| `participants.spec.ts` | 3      | Navegação, tabela, filtro de busca               |
| `checkin.spec.ts`      | 3      | Navegação, seletor, regras auto-carregadas       |

---

## 5. Lint e formatação

```bash
npm run lint              # verifica problemas de lint
npx prettier --write .    # formata todo o código
```

**Configurações:**
- ESLint: `next/core-web-vitals` + `next/typescript` + `prettier`
- Prettier: sem ponto-e-vírgula, aspas duplas, trailing comma ES5, 100 chars/linha
- Commitlint + Husky: commits seguem Conventional Commits

---

## 6. Guia de validação por feature

Siga esta ordem para validar cada funcionalidade:

### 6.1 — Autenticação

1. Acesse `/login`
2. Submeta com campos vazios → **mensagens de erro nos campos**
3. Tente com email inválido → **erro de formato**
4. Tente com credenciais erradas → **"Credenciais inválidas"**
5. Login com `admin@eventos.com` / `123456` → **redireciona para Dashboard**
6. Recarregue (F5) → **permanece logado** (JWT em sessionStorage)
7. Clique em "Sair" → **volta para `/login`**
8. Acesse `/` sem login → **redireciona para `/login`**

### 6.2 — Dashboard

1. Após login, observe os **4 cards de estatísticas**
2. Dados carregam via **TanStack Query** (skeleton aparece brevemente)
3. Seções: **Próximos Eventos** e **Check-ins Recentes**
4. **Gráfico Recharts** (check-in feito vs pendente)

### 6.3 — Eventos

1. Navegue para `/eventos`
2. **Tabela com paginação** (10 por página)
3. **Busca** por nome ou local
4. **Filtro por status** (Todos, Ativo, Encerrado)
5. **Filtro por período** (De / Até)
6. Ações: **Ver detalhes**, **Editar**, **Remover** (via menu ⋯)
7. **Novo Evento** → validação Zod no formulário
8. Mobile → **tabela vira cards**

### 6.4 — Participantes

1. Navegue para `/participantes`
2. **Busca** por nome ou email
3. **Filtro por evento** e **filtro por check-in**
4. **Fazer/Desfazer Check-in** via menu ⋯
5. **Editar** → transferir para outro evento
6. **Novo Participante** → validação Zod
7. Mobile → **layout responsivo**

### 6.5 — Configuração de Check-in

1. Navegue para `/checkin`
2. Selecione evento no dropdown
3. Veja **regras existentes** carregadas via TanStack Query
4. **Adicionar Regra** → nome, obrigatória/opcional, janela de minutos
5. **Toggle** desabilita regra (opacidade reduzida)
6. **Warnings automáticos**: nome vazio, duplicado, valores negativos, janela zero
7. **Conflitos**: regras obrigatórias com janelas incompatíveis → borda vermelha
8. **Salvar** → habilitado apenas com mudanças E nomes preenchidos

---

## 7. Arquitetura do projeto

```
desafio-vlab/
├── app/                            # Next.js App Router
│   ├── (groups)/                   # Route group — layout compartilhado
│   │   ├── layout.tsx              # Sidebar + header + auth guard
│   │   ├── page.tsx                # Dashboard (/)
│   │   ├── loading.tsx             # ← Skeleton automático (Suspense)
│   │   ├── error.tsx               # ← Error boundary automático
│   │   ├── eventos/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── participantes/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── checkin/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── actions/                    # ← Server Actions (mutações server-side)
│   │   ├── event.actions.ts
│   │   ├── participant.actions.ts
│   │   └── checkin.actions.ts
│   ├── pages/                      # Client Components das páginas
│   │   ├── layout.tsx              # Dashboard layout (auth guard)
│   │   ├── dashboard.tsx
│   │   ├── events.tsx
│   │   ├── participants.tsx
│   │   ├── checkin.tsx
│   │   └── login.tsx
│   ├── login/page.tsx              # Rota pública
│   ├── layout.tsx                  # Root layout (providers)
│   └── globals.css
│
├── features/                       # ★ Módulos por domínio (fatias verticais)
│   ├── events/
│   │   ├── hooks/use-events.ts     #   TanStack Query hooks
│   │   └── index.ts                #   Barrel export
│   ├── participants/
│   │   ├── hooks/use-participants.ts
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── hooks/use-dashboard.ts
│   │   └── index.ts
│   └── checkin/
│       ├── hooks/use-checkin-queries.ts
│       └── index.ts
│
├── components/                     # Componentes de UI
│   ├── dashboard/                  # Stats, gráfico, listas
│   ├── events/                     # Tabela, toolbar, form
│   ├── participants/               # Tabela, toolbar, form
│   ├── checkin/                    # Rule cards, alerts, manager
│   ├── shared/                     # ← Componentes reutilizáveis (ErrorCard)
│   ├── ui/                         # shadcn/ui (intocável)
│   ├── app-sidebar.tsx
│   ├── app-header.tsx
│   └── login-form.tsx
│
├── contexts/
│   └── auth-context.tsx            # AuthProvider (Context API + JWT)
│
├── hooks/
│   └── use-checkin-rules.ts        # Lógica pura de validação de regras
│
├── lib/
│   ├── api.ts                      # Camada de API (mock com delay)
│   ├── mock-data.ts                # Dados simulados
│   ├── types.ts                    # Interfaces TypeScript
│   ├── validations.ts              # Re-export dos schemas (backward compat)
│   ├── schemas/                    # ← Schemas Zod por domínio
│   │   ├── event.schema.ts
│   │   ├── participant.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── checkin.schema.ts
│   │   └── index.ts
│   ├── providers/
│   │   └── query-provider.tsx      # ← TanStack Query provider
│   ├── constants.ts
│   └── utils.ts
│
├── __tests__/                      # Testes unitários (Jest)
├── e2e/                            # ← Testes E2E (Playwright)
├── playwright.config.ts            # ← Config do Playwright
├── jest.config.mjs
├── eslint.config.mjs
└── .prettierrc
```

---

## 8. Stack técnica

| Categoria             | Tecnologia                                |
|-----------------------|-------------------------------------------|
| Framework             | Next.js 16 (App Router, Turbopack)        |
| Linguagem             | TypeScript 5.7                            |
| Estilização           | Tailwind CSS 4 + shadcn/ui               |
| Componentes UI        | Radix UI                                  |
| Server-state          | **TanStack Query (React Query)**          |
| Validação             | **Zod** (client + server)                 |
| Formulários           | React Hook Form + `@hookform/resolvers`   |
| Mutações server-side  | **Next.js Server Actions**                |
| Estado global         | React Context API (apenas auth)           |
| Gráficos              | Recharts                                  |
| Ícones                | Lucide React                              |
| Toasts                | Sonner                                    |
| Testes unitários      | Jest 30 + Testing Library                 |
| Testes E2E            | **Playwright**                            |
| Lint                  | ESLint 9 + Prettier                       |
| Commits               | Commitlint + Husky (conventional)         |

---

## 9. Decisões técnicas — Briefing

### Por que Feature-Based Architecture (fatias verticais)?

O projeto começou com a estrutura padrão por tipo (`components/`, `hooks/`, `lib/`). À medida que cresce, isso gera **acoplamento implícito** — um componente de eventos importa um hook de participantes que importa a API de check-in. Com fatias verticais:

- **Cada feature é autocontida**: hooks, schemas, barrel export no mesmo módulo
- **Baixo acoplamento**: deletar `features/checkin/` inteira nunca quebra `features/events/`
- **Onboarding rápido**: "Preciso mexer em eventos? Tudo está em `features/events/`"
- **Regra de ouro**: features nunca importam entre si. Compartilhado vai para `lib/` ou `components/shared/`

### Por que TanStack Query em vez de useState + useEffect?

O MVP original tinha ~30 linhas de boilerplate por página (useState para dados, loading, error + useEffect + try/catch). Com TanStack Query:

```tsx
// ANTES — boilerplate manual
const [events, setEvents] = useState<Event[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
useEffect(() => { loadEvents() }, [])

// DEPOIS — 1 linha, com cache + retry grátis
const { data: events, isLoading, error } = useEvents()
```

Ganhos: **cache automático**, **refetch inteligente**, **invalidação após mutações**, **dedup de requests**, **zero boilerplate de loading/error**.

### Por que Server Actions com Zod?

Server Actions são funções que rodam **exclusivamente no servidor**. Combinadas com Zod, criam uma camada de **validação dupla**:

1. **Client**: React Hook Form + Zod → feedback instantâneo pro usuário
2. **Server**: Server Action + Zod → segurança contra requests forjadas

```typescript
// Mesmo schema usado nos dois lados
const parsed = eventFormSchema.safeParse(raw)
```

Isso elimina o drift entre validação de form e validação de API — **single source of truth**.

### Por que loading.tsx e error.tsx no App Router?

São convenções do Next.js que envolvem automaticamente a página em `<Suspense>` e `<ErrorBoundary>`. **Zero código de boilerplate** — cada rota tem resiliência de graça.

### Por que `useCheckinRules` é um hook separado (e não usa TanStack Query)?

A lógica de check-in envolve **draft local** — o usuário edita regras antes de salvar. O TanStack Query gerencia **server-state** (dados que vêm do backend). O `useCheckinRules` gerencia **editing-state** (dados temporários que o usuário está modificando). São responsabilidades diferentes.

O `useCheckinRulesQuery` (TanStack Query) carrega as regras do server. O `useCheckinRules` (hook local) gerencia o editing.

### Por que `validateRules` é uma função pura exportada?

Pode ser testada diretamente como função pura sem precisar de `renderHook`. É mais rápido, sem riscos de re-render infinito, e cobre 100% das regras de negócio isoladamente.

### Por que mock API?

A API real ainda não existe. O mock simula delays reais (500ms) e persiste dados em memória, reproduzindo o comportamento de um backend. Para trocar para um backend real, basta modificar **apenas `lib/api.ts`** — nenhuma feature precisa mudar (Dependency Inversion Principle).

### Por que Context API para auth (e não Zustand/Redux)?

Auth é um estado global simples: `user`, `token`, `login()`, `logout()`. Muda raramente (apenas no login/logout). Context API é suficiente. Usar uma lib de state management para isso seria over-engineering.

### Por que cookies espelho não foram usados + middleware?

A aplicação usa um mock client-side. O guard de rotas funciona no layout via `useAuth()` + redirect. Para um backend real com JWT, seria recomendável adicionar o middleware em conjunto com cookies, mas para o escopo atual, a validação client-side é suficiente e mantém a arquitetura simples.

---

## 10. Como adicionar uma nova feature

1. Crie `features/nova-feature/hooks/use-nova-feature.ts` com hooks TanStack Query
2. Crie `features/nova-feature/index.ts` (barrel export)
3. Crie a página em `app/(groups)/nova-rota/page.tsx`
4. Adicione `loading.tsx` e `error.tsx` na mesma pasta
5. (Opcional) Crie uma Server Action em `app/actions/nova-feature.actions.ts`
6. (Opcional) Crie um schema Zod em `lib/schemas/nova-feature.schema.ts`
7. Adicione a rota em `lib/constants.ts` (navItems)

**Regras de importação:**
```
✅ app/ → features/        (pages importam features)
✅ app/ → components/       (pages importam componentes)
✅ features/ → lib/         (features importam utils)
❌ features/ → features/    (NUNCA — sem acoplamento horizontal)
```
