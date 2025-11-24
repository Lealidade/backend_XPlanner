# XPlanner – Backend

Backend da aplicação **XPlanner**, focada em **educação financeira** + **gamificação**.

O backend expõe APIs para:

- Onboarding com quiz financeiro que gera um **perfil por dimensão**:
  - `DESENROLA`, `ORGANIZA`, `RESERVA`, `INVESTE`
- **Metas financeiras (goals)** ligadas a essas dimensões
- **Fluxo de caixa (cash flow)** integrado às metas
- **Trilhas de aprendizado (learning paths)** recomendadas com base no perfil
- **Visão geral (overview)** combinando perfil + metas + fluxo de caixa

---

## Stack

- **Node.js** (recomendado: v22+)
- **TypeScript**
- **Fastify** (API HTTP)
- **Prisma ORM** + **PostgreSQL**
- **Docker / Docker Compose** (para o banco)
- **Better Auth** (autenticação)
- **tsyringe** (injeção de dependência)
- **Zod** (validação)

---

## Pré-requisitos

Certifique-se de ter instalado na máquina:

- **Node.js** (22+ recomendado)
- **npm** (instalado junto com o Node)
- **Docker**
- **Docker Compose**

---

## Como rodar o projeto localmente

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd xplanner
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, por exemplo:

```env
# URL do banco de dados PostgreSQL usado pelo Prisma
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/xplanner?schema=public"

# Better Auth
BETTER_AUTH_SECRET=uma_senha_grande_e_aleatoria
BETTER_AUTH_URL=http://localhost:3000
```

**Observações:**

- Ajuste `DATABASE_URL` se o seu Docker Compose usar outro usuário/senha/porta.
- `BETTER_AUTH_SECRET` pode ser qualquer string grande e aleatória (em produção, isso deve ser bem protegida).

### 4. Subir o banco de dados com Docker Compose

Na raiz do projeto (onde está o `docker-compose.yml`):

```bash
docker compose up -d
```

Isso deve subir um container PostgreSQL acessível em algo como `localhost:5432`.

### 5. Rodar migrações do Prisma

Para ambiente de produção/dev simples:

```bash
npx prisma migrate deploy
```

Ou, para ambiente de desenvolvimento com migrações interativas:

```bash
npx prisma migrate dev
```

### 6. Rodar o seed do banco (dados iniciais)

O projeto já tem script de seed configurado:

```bash
npm run db:seed
```

Isso normalmente popula:

- Perguntas e opções do quiz de onboarding
- Templates de metas financeiras
- Trilhas de aprendizado (learning paths) e seus passos

### 7. Iniciar o servidor

```bash
npm run dev
```

Por padrão a API sobe em:

```text
http://localhost:3000
```

---

## Sobre autenticação

Quase todas as rotas abaixo assumem que o usuário está **autenticado via Better Auth**.

Usamos algo como:

```ts
const session = await auth.api.getSession({
  headers: toWebHeaders(request.headers as any),
});
```

Ou seja, ele espera receber os **cookies de sessão do Better Auth** nos headers.

Se você estiver usando apenas o backend:

- Reaproveite os cookies da aplicação frontend; **ou**
- Chame as rotas padrão do Better Auth para criar conta / fazer login  
  (não estão documentadas aqui porque o foco é o domínio de finanças).

> Nos exemplos abaixo, os headers de autenticação são omitidos para não poluir, mas **todas essas rotas exigem usuário autenticado**.

---

## Rotas – Onboarding & Perfil Financeiro

### 5.1. `GET /onboarding/quiz`

Retorna o quiz de onboarding (perguntas + opções) e garante a criação de um `UserXP` para o usuário.

- **Auth:** obrigatório
- **Body:** nenhum

**Exemplo de resposta:**

```json
{
  "userXPId": "cmianxwv10001hvyvj4p6y5h9",
  "questions": [
    {
      "id": "q1",
      "text": "Quando você pensa nas suas dívidas, como se sente?",
      "dimension": "DESENROLA",
      "order": 1,
      "isActive": true,
      "options": [
        {
          "id": "opt1",
          "label": "Tenho dívidas atrasadas e não sei por onde começar",
          "weight": -3,
          "explanation": "Começar mapeando tudo e montando um plano ajuda a 'desenrolar'."
        },
        {
          "id": "opt2",
          "label": "Tenho dívidas, mas controlo bem as parcelas",
          "weight": 0,
          "explanation": null
        }
      ]
    }
  ]
}
```

---

### 5.2. `POST /onboarding/quiz/answers`

Recebe as respostas do quiz de onboarding, calcula o `FinancialProfile` do usuário e retorna:

- Score geral (`overallScore`, 0–1000)
- Score por dimensão (`desenrolaScore`, `organizaScore`, `reservaScore`, `investeScore`)
- `lastScoreChange` (quanto o score geral mudou nessa última avaliação)
- Feedback por pergunta/opção

- **Auth:** obrigatório
- **Body:**

```json
{
  "answers": [
    {
      "questionId": "q1",
      "optionIndex": 0
    },
    {
      "questionId": "q2",
      "optionIndex": 2
    }
  ]
}
```

> `optionIndex` é o índice da opção no array `options` retornado na rota `/onboarding/quiz` (`0`, `1`, `2`...).

**Resposta (exemplo simplificado):**

```json
{
  "financialProfile": {
    "overallScore": 542,
    "desenrolaScore": 450,
    "organizaScore": 600,
    "reservaScore": 500,
    "investeScore": 620,
    "lastScoreChange": 42
  },
  "questionsFeedback": [
    {
      "questionId": "q1",
      "text": "Quando você pensa nas suas dívidas, como se sente?",
      "dimension": "DESENROLA",
      "selectedOptionId": "opt1",
      "selectedOptionLabel": "Tenho dívidas atrasadas e não sei por onde começar",
      "selectedOptionPoints": -15,
      "selectedOptionIsBest": false,
      "bestOptionId": "opt3",
      "bestOptionLabel": "Não tenho dívidas em atraso",
      "bestOptionPoints": 15,
      "bestOptionExplanation": "Manter as contas em dia é o primeiro passo para desenrolar.",
      "options": [
        {
          "id": "opt1",
          "label": "Tenho dívidas atrasadas e não sei por onde começar",
          "points": -15,
          "isBest": false,
          "explanation": "..."
        },
        {
          "id": "opt3",
          "label": "Não tenho dívidas em atraso",
          "points": 15,
          "isBest": true,
          "explanation": "..."
        }
      ]
    }
  ]
}
```

---

### 5.3. `GET /onboarding/financial-profile/me`

Retorna o perfil financeiro atual do usuário, se ele já respondeu o quiz de onboarding.

- **Auth:** obrigatório
- **Body:** nenhum

**Caso ainda não tenha perfil:**

```json
{
  "hasProfile": false,
  "message": "User has not completed onboarding quiz yet.",
  "profile": null
}
```

**Caso já tenha perfil:**

```json
{
  "hasProfile": true,
  "profile": {
    "id": "cmiao1fi10003hvyv5if0x0pq",
    "userXPId": "cmianxwv10001hvyvj4p6y5h9",
    "overallScore": 542,
    "desenrolaScore": 1000,
    "organizaScore": 500,
    "reservaScore": 167,
    "investeScore": 500,
    "hasCompletedOnboarding": true,
    "lastScoreChange": 42,
    "lastCalculatedAt": "2025-11-22T19:12:11.448Z",
    "createdAt": "2025-11-22T19:12:11.449Z",
    "updatedAt": "2025-11-22T19:12:11.449Z"
  }
}
```

---

## Rotas – Cash Flow

### 6.1. `POST /cash-flow`

Cria uma nova movimentação de fluxo de caixa (entrada, saída ou transferência).  
Pode (ou não) estar vinculada a uma meta (`userGoalId`).

- **Auth:** obrigatório
- **Body:**

```json
{
  "date": "2025-11-22T15:30:00.000Z",
  "label": "Pagamento cartão Nubank",
  "category": "Cartão de crédito",
  "operation": "EXPENSE",
  "amount": 500,
  "userGoalId": "cmiaor2kr000dhvyvxporzao0",
  "recipient": "Nubank"
}
```

> `operation`: `"INCOME" | "EXPENSE" | "TRANSFER"`  
> `userGoalId` é opcional (se quiser associar a uma meta).

**Resposta:**

```json
{
  "cashFlow": {
    "id": "cmiapgmhe0001hvw6wlmdupdk",
    "userXPId": "cmianxwv10001hvyvj4p6y5h9",
    "userGoalId": "cmiaor2kr000dhvyvxporzao0",
    "date": "2025-11-22T15:30:00.000Z",
    "operation": "EXPENSE",
    "value": 500,
    "label": "Pagamento cartão Nubank",
    "category": "Cartão de crédito",
    "recipient": "Nubank",
    "createdAt": "2025-11-22T19:51:59.954Z"
  }
}
```

---

### 6.2. `GET /cash-flow/summary?month=&year=`

Retorna um resumo do fluxo de caixa no mês/ano especificado.

- **Auth:** obrigatório
- **Query params (opcionais):**
  - `month` – `1` a `12` (default = mês atual)
  - `year` – ex: `2025` (default = ano atual)

**Exemplo:**

```http
GET /cash-flow/summary?month=11&year=2025
```

**Resposta:**

```json
{
  "period": {
    "month": 11,
    "year": 2025
  },
  "totals": {
    "income": 5000,
    "expense": 2300,
    "netBalance": 2700
  },
  "byCategory": [
    {
      "category": "Salário",
      "income": 5000,
      "expense": 0
    },
    {
      "category": "Cartão de crédito",
      "income": 0,
      "expense": 800
    }
  ],
  "byDimension": [
    {
      "dimension": "DESENROLA",
      "income": 0,
      "expense": 800
    },
    {
      "dimension": "RESERVA",
      "income": 0,
      "expense": 500
    }
  ]
}
```

---

## Rotas – Metas & Gamificação (Goals)

**Prefixo:** `/gamification/goals`

### 7.1. `GET /gamification/goals/templates`

Lista todos os templates de metas disponíveis (seedados no banco).

- **Auth:** obrigatório

**Resposta (exemplo):**

```json
{
  "templates": [
    {
      "id": "cmianx6k70000hvxebxwp7lx1",
      "title": "Quitar dívidas",
      "description": "Organize suas dívidas e saia do vermelho.",
      "type": "SHORT_TERM",
      "riskLevel": "LOW",
      "dimension": "DESENROLA",
      "category": "OTHER",
      "recommendedProducts": ["XP Card", "Planilha de dívidas"],
      "iconUrl": "https://example.com/icons/debt.png",
      "xpPointsRewardOnCompletion": 200,
      "xpCoinsRewardOnCompletion": 10
    }
  ]
}
```

---

### 7.2. `GET /gamification/goals/me`

Lista todas as metas do usuário (instâncias de `UserGoal`, com ou sem template).

- **Auth:** obrigatório

**Resposta (exemplo):**

```json
{
  "goals": [
    {
      "id": "cmiaor2kr000dhvyvxporzao0",
      "userXPId": "cmianxwv10001hvyvj4p6y5h9",
      "goalId": "cmianx6k70000hvxebxwp7lx1",
      "customTitle": "Pagar cartão Nubank (2)",
      "targetAmount": 3000,
      "currentAmount": 1500,
      "targetDate": "2025-12-25T00:00:00.000Z",
      "recommendedMonthlyDeposit": 2797,
      "progressPercent": 50,
      "isActive": true,
      "completedAt": null,
      "lastContributionAt": null,
      "xpCoinsRewardOnCompletion": 0,
      "createdAt": "2025-11-22T19:32:07.755Z",
      "updatedAt": "2025-11-22T19:51:59.945Z",
      "goal": {
        "id": "cmianx6k70000hvxebxwp7lx1",
        "title": "Quitar dívidas",
        "dimension": "DESENROLA",
        "xpPointsRewardOnCompletion": 200,
        "xpCoinsRewardOnCompletion": 10
      }
    }
  ]
}
```

---

### 7.3. `POST /gamification/goals`

Cria uma nova meta financeira.

Pode ser:

- Baseada em um template (`templateId` preenchido); ou
- 100% customizada (sem `templateId`).

- **Auth:** obrigatório
- **Body (exemplo com template):**

```json
{
  "templateId": "cmianx6k70000hvxebxwp7lx1",
  "customTitle": "Quitar dívidas do cartão Nubank",
  "targetAmount": 3000,
  "currentAmount": 0,
  "targetDate": "2025-12-31T00:00:00.000Z"
}
```

**Resposta (exemplo):**

```json
{
  "goal": {
    "id": "cmiaor2kr000dhvyvxporzao0",
    "userXPId": "cmianxwv10001hvyvj4p6y5h9",
    "goalId": "cmianx6k70000hvxebxwp7lx1",
    "customTitle": "Quitar dívidas do cartão Nubank",
    "targetAmount": 3000,
    "currentAmount": 0,
    "targetDate": "2025-12-31T00:00:00.000Z",
    "recommendedMonthlyDeposit": 250,
    "progressPercent": 0,
    "isActive": true,
    "completedAt": null,
    "xpCoinsRewardOnCompletion": 10,
    "createdAt": "2025-11-22T19:32:07.755Z",
    "updatedAt": "2025-11-22T19:32:07.755Z",
    "goal": {
      "id": "cmianx6k70000hvxebxwp7lx1",
      "title": "Quitar dívidas",
      "dimension": "DESENROLA"
    }
  }
}
```

> **Obs.:** Ao criar a meta, o backend pode aplicar uma penalidade na dimensão correspondente do `FinancialProfile` (ex.: `DESENROLA` cai um pouco) para refletir a “nova dívida assumida”.

---

### 7.4. `PATCH /gamification/goals/:id/progress`

Atualiza diretamente o valor atual da meta (`currentAmount`).  
É uma rota mais “administrativa” / manual (sem cash flow automático).

- **Auth:** obrigatório
- **Body:**

```json
{
  "currentAmount": 1500
}
```

**Resposta:**

```json
{
  "goal": {
    "...": "mesmo formato da meta",
    "currentAmount": 1500,
    "progressPercent": 50
  }
}
```

---

### 7.5. `POST /gamification/goals/:id/contribute`

Rota principal para contribuir para uma meta.

Ela:

- Incrementa o `currentAmount`
- Cria um registro de `CashFlow` (despesa)
- Atualiza o `FinancialProfile`, devolvendo score na dimensão associada
- Se a meta for concluída nesse momento, concede XP / coins

- **Auth:** obrigatório
- **URL:**

```http
POST /gamification/goals/{goalId}/contribute
```

- **Body (exemplo):**

```json
{
  "amount": 500,
  "date": "2025-11-22T15:30:00.000Z",
  "label": "Pagamento parcial Nubank (2)",
  "category": "Cartão de crédito",
  "recipient": "Nubank"
}
```

**Resposta (exemplo):**

```json
{
  "goal": {
    "id": "cmiaor2kr000dhvyvxporzao0",
    "userXPId": "cmianxwv10001hvyvj4p6y5h9",
    "goalId": null,
    "customTitle": "Pagar cartão Nubank (2)",
    "targetAmount": 3000,
    "currentAmount": 1500,
    "targetDate": "2025-12-25T00:00:00.000Z",
    "recommendedMonthlyDeposit": 2797,
    "progressPercent": 50,
    "isActive": true,
    "completedAt": null,
    "lastContributionAt": null,
    "xpCoinsRewardOnCompletion": 0,
    "createdAt": "2025-11-22T19:32:07.755Z",
    "updatedAt": "2025-11-22T19:51:59.945Z",
    "goal": null
  },
  "cashFlow": {
    "id": "cmiapgmhe0001hvw6wlmdupdk",
    "userXPId": "cmianxwv10001hvyvj4p6y5h9",
    "userGoalId": "cmiaor2kr000dhvyvxporzao0",
    "date": "2025-11-22T15:30:00.000Z",
    "operation": "EXPENSE",
    "value": 500,
    "label": "Pagamento parcial Nubank (2)",
    "category": "Cartão de crédito",
    "recipient": "Nubank",
    "createdAt": "2025-11-22T19:51:59.954Z"
  },
  "profile": {
    "id": "cmiao1fi10003hvyv5if0x0pq",
    "userXPId": "cmianxwv10001hvyvj4p6y5h9",
    "overallScore": 542,
    "desenrolaScore": 1000,
    "organizaScore": 500,
    "reservaScore": 167,
    "investeScore": 500,
    "hasCompletedOnboarding": true,
    "lastScoreChange": 42,
    "lastCalculatedAt": "2025-11-22T19:12:11.448Z",
    "createdAt": "2025-11-22T19:12:11.449Z",
    "updatedAt": "2025-11-22T19:12:11.449Z"
  }
}
```

---

## Rotas – Trilhas de Aprendizado (Learning Paths)

**Prefixo:** `/learning-paths`

### 8.1. `GET /learning-paths/recommended`

Retorna trilhas de aprendizado recomendadas com base no `FinancialProfile` do usuário.

- **Auth:** obrigatório

**Caso tenha perfil:**

```json
{
  "hasProfile": true,
  "profile": {
    "overallScore": 542,
    "desenrolaScore": 450,
    "organizaScore": 600,
    "reservaScore": 500,
    "investeScore": 620
  },
  "recommendedPaths": [
    {
      "id": "path1",
      "slug": "comece-pelas-dividas",
      "title": "Comece pelas dívidas",
      "description": "Entenda suas dívidas e monte um plano para sair do vermelho.",
      "dimension": "DESENROLA",
      "level": "BEGINNER",
      "estimatedMinutes": 45,
      "priority": 1,
      "steps": [
        {
          "id": "step1",
          "order": 1,
          "title": "Organizando suas dívidas",
          "type": "ARTICLE",
          "xpContentUrl": "https://conteudo.xp.com.br/...",
          "estimatedMinutes": 10
        }
      ]
    }
  ]
}
```

**Caso ainda não tenha perfil:**

```json
{
  "hasProfile": false,
  "message": "User has not completed onboarding quiz yet.",
  "profile": null,
  "recommendedPaths": []
}
```

---

### 8.2. `GET /learning-paths/:id`

Retorna uma trilha específica (com seus passos).

- **Auth:** obrigatório
- **Exemplo:**

```http
GET /learning-paths/path1
```

**Resposta (exemplo):**

```json
{
  "id": "path1",
  "slug": "comece-pelas-dividas",
  "title": "Comece pelas dívidas",
  "description": "Entenda suas dívidas e monte um plano para sair do vermelho.",
  "dimension": "DESENROLA",
  "level": "BEGINNER",
  "estimatedMinutes": 45,
  "isActive": true,
  "order": 1,
  "steps": [
    {
      "id": "step1",
      "learningPathId": "path1",
      "order": 1,
      "title": "Organizando suas dívidas",
      "type": "ARTICLE",
      "xpContentUrl": "https://conteudo.xp.com.br/...",
      "estimatedMinutes": 10
    }
  ]
}
```

---

### 8.3. `GET /learning-paths/:id/progress`

Retorna o progresso do usuário em uma trilha específica.

- **Auth:** obrigatório

**Resposta (exemplo):**

```json
{
  "learningPathId": "path1",
  "totalSteps": 5,
  "completedStepsIds": ["step1", "step2"],
  "progressPercent": 40
}
```

---

### 8.4. `POST /learning-paths/steps/:stepId/complete`

Marca um passo da trilha como concluído e concede XP/coins de acordo com o tipo do passo (quiz, artigo, vídeo etc.).

- **Auth:** obrigatório
- **URL:**

```http
POST /learning-paths/steps/{stepId}/complete
```

- **Body:** vazio (tudo vem da URL e da sessão)

**Resposta (exemplo):**

```json
{
  "progress": {
    "id": "pls123",
    "userXPId": "cmianxwv10001hvyvj4p6y5h9",
    "learningStepId": "step1",
    "completedAt": "2025-11-22T20:10:00.000Z",
    "createdAt": "2025-11-22T20:10:00.000Z",
    "updatedAt": "2025-11-22T20:10:00.000Z"
  },
  "rewards": {
    "xpPoints": 20,
    "xpCoins": 0
  }
}
```

> Se o passo já estiver concluído, ele retorna o progresso existente e `rewards` com `xpPoints: 0`, `xpCoins: 0`.

---

## Rotas – Overview de Saúde Financeira

**Prefixo:** `/financial-health`

### 9.1. `GET /financial-health/overview?month=&year=`

Retorna um painel consolidado da saúde financeira do usuário:

- Score do perfil financeiro (por dimensão)
- Resumo do fluxo de caixa no período
- Quantidade de metas ativas e concluídas

- **Auth:** obrigatório
- **Query params (opcionais):**
  - `month` – `1` a `12` (padrão = mês atual)
  - `year` – ex: `2025` (padrão = ano atual)

**Exemplo:**

```http
GET /financial-health/overview?month=11&year=2025
```

**Resposta (exemplo):**

```json
{
  "period": {
    "month": 11,
    "year": 2025
  },
  "financialProfile": {
    "hasProfile": true,
    "profile": {
      "overallScore": 542,
      "desenrolaScore": 1000,
      "organizaScore": 500,
      "reservaScore": 167,
      "investeScore": 500,
      "lastScoreChange": 42
    }
  },
  "cashFlow": {
    "totals": {
      "income": 5000,
      "expense": 2300,
      "netBalance": 2700
    },
    "byCategory": [
      {
        "category": "Salário",
        "income": 5000,
        "expense": 0
      },
      {
        "category": "Cartão de crédito",
        "income": 0,
        "expense": 800
      }
    ],
    "byDimension": [
      {
        "dimension": "DESENROLA",
        "income": 0,
        "expense": 800
      },
      {
        "dimension": "RESERVA",
        "income": 0,
        "expense": 500
      }
    ]
  },
  "goals": {
    "activeGoalsCount": 2,
    "completedGoalsCount": 1
  }
}
```

---

## Como testar rapidamente (frontend / recrutador)

1. Clonar o repositório e rodar `npm install`.
2. Configurar `.env` com `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
3. Subir banco com:

   ```bash
   docker compose up -d
   ```

4. Rodar migrações:

   ```bash
   npx prisma migrate deploy
   ```

5. Rodar seed:

   ```bash
   npm run db:seed
   ```

6. Iniciar API:

   ```bash
   npm run dev
   ```

7. Usar um cliente HTTP (Bruno / Insomnia / Postman) para chamar:

   - `GET /onboarding/quiz` → responder quiz via `POST /onboarding/quiz/answers`
   - `GET /onboarding/financial-profile/me`
   - `GET /gamification/goals/templates` → `POST /gamification/goals`
   - `POST /gamification/goals/:id/contribute`
   - `GET /financial-health/overview`
   - `GET /learning-paths/recommended` e `GET /learning-paths/:id`

> Lembrando: todas essas rotas assumem usuário autenticado, então é necessário estar com os **cookies de sessão do Better Auth** presentes nas requisições.
