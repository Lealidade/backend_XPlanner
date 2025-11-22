1. Users
1.1. GET /user-xp/me

Nome sugerido no Bruno: GET [Users] UserXP - Me

Retorna o registro bruto de UserXP do usuário autenticado.

Exemplo de resposta
{
  "userXP": {
    "id": "cmi1k88gt0001hv2chygsk450",
    "userId": "auth_user_id",
    "username": "teste+1",
    "birthYear": 1999,
    "avatarUrl": null,
    "totalXp": 190,
    "currentLevel": "Budget Explorer",
    "xpToNextLevel": 110,
    "xpCoinsBalance": 10,
    "dayStreak": 0,
    "createdAt": "2025-11-17T18:40:00.000Z",
    "updatedAt": "2025-11-21T00:09:47.111Z"
  }
}


O front pode usar isso para telas de perfil/edit mais cruas.

2. Onboarding (quiz diagnóstico)
2.1. GET /onboarding/quiz

Nome: GET [Onboarding] Get quiz

Retorna as perguntas e opções do quiz diagnóstico inicial.

Exemplo de resposta
{
  "questions": [
    {
      "id": "diagnostic_desenrola_1",
      "text": "Você sente que suas dívidas estão sob controle?",
      "dimension": "DESENROLA",
      "order": 1,
      "options": [
        {
          "id": "opt_1",
          "label": "Sim, totalmente sob controle"
        },
        {
          "id": "opt_2",
          "label": "Mais ou menos, às vezes me perco"
        },
        {
          "id": "opt_3",
          "label": "Não, estou bem enrolado(a)"
        }
      ]
    }
    // ...
  ]
}

2.2. POST /onboarding/quiz/answers

Nome: POST [Onboarding] Enviar Respostas

Envia as respostas do usuário e retorna o perfil financeiro + feedback da prova.

Body esperado
{
  "answers": [
    {
      "questionId": "diagnostic_desenrola_1",
      "selectedOptionId": "opt_2"
    }
    // ...
  ]
}

Exemplo de resposta
{
  "financialProfile": {
    "overallScore": 375,
    "desenrolaScore": 500,
    "organizaScore": 0,
    "reservaScore": 500,
    "investeScore": 500
  },
  "questionsFeedback": [
    {
      "questionId": "diagnostic_desenrola_1",
      "dimension": "DESENROLA",
      "text": "Você sente que suas dívidas estão sob controle?",
      "selectedOptionId": "opt_2",
      "selectedOptionLabel": "Mais ou menos, às vezes me perco",
      "selectedOptionPoints": 0,
      "selectedOptionIsBest": false,
      "bestOptionId": "opt_1",
      "bestOptionLabel": "Sim, totalmente sob controle",
      "bestOptionPoints": 3,
      "bestOptionExplanation": "Ótimo! Manter as dívidas sob controle é o primeiro passo.",
      "options": [
        {
          "id": "opt_1",
          "label": "Sim, totalmente sob controle",
          "points": 3,
          "isBest": true,
          "explanation": "Ótimo! Manter as dívidas sob controle é o primeiro passo."
        }
        // ...
      ]
    }
  ]
}

2.3. GET /onboarding/financial-profile

Nome: GET [Onboarding] Get Financial Profiler

Retorna o perfil financeiro atual do usuário (sem precisar refazer o quiz).

{
  "profile": {
    "overallScore": 375,
    "desenrolaScore": 500,
    "organizaScore": 0,
    "reservaScore": 500,
    "investeScore": 500,
    "hasCompletedOnboarding": true,
    "lastCalculatedAt": "2025-11-17T18:50:00.000Z"
  }
}

3. Learning (trilhas de conteúdo)

Base prefix: /learning-paths

3.1. GET /learning-paths/recommended

Nome: GET [Learning] Get Trilha Recomendada

Retorna as trilhas recomendadas para o usuário, com base no FinancialProfile.

Exemplo de resposta (real seu)
{
  "hasProfile": true,
  "profile": {
    "overallScore": 375,
    "desenrolaScore": 500,
    "organizaScore": 0,
    "reservaScore": 500,
    "investeScore": 500
  },
  "recommendedPaths": [
    {
      "id": "cmi3hrwi20003hvx349f5cw7y",
      "slug": "investe_iniciantes_seguro",
      "title": "Comece a investir com segurança",
      "description": "Trilha para quem está dando os primeiros passos nos investimentos e quer montar uma base sólida e segura.",
      "dimension": "INVESTE",
      "level": "BASIC",
      "estimatedMinutes": 35,
      "priority": 4,
      "steps": [
        {
          "id": "cmi3i6m0k000dhvx3ks1nexlk",
          "order": 1,
          "title": "Investimentos para iniciantes: 9 opções pra começar",
          "type": "ARTICLE",
          "xpContentUrl": "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimento-para-iniciantes/",
          "estimatedMinutes": 10
        }
        // ...
      ]
    }
    // outras trilhas...
  ]
}

3.2. GET /learning-paths/:id

Nome: GET [Learning] Get Trilha By Id

Retorna os detalhes completos de uma trilha.

Path params

id – ID da trilha (cmi3hrwi20003hvx349f5cw7y, por exemplo)

Exemplo de resposta (real seu)
{
  "id": "cmi3hrwi20003hvx349f5cw7y",
  "slug": "investe_iniciantes_seguro",
  "title": "Comece a investir com segurança",
  "description": "Trilha para quem está dando os primeiros passos nos investimentos e quer montar uma base sólida e segura.",
  "dimension": "INVESTE",
  "level": "BASIC",
  "estimatedMinutes": 35,
  "imageUrl": null,
  "totalSteps": null,
  "isActive": true,
  "order": 1,
  "createdAt": "...",
  "updatedAt": "...",
  "steps": [
    {
      "id": "cmi3i6m0k000dhvx3ks1nexlk",
      "learningPathId": "cmi3hrwi20003hvx349f5cw7y",
      "order": 1,
      "title": "Investimentos para iniciantes: 9 opções pra começar",
      "type": "ARTICLE",
      "xpContentUrl": "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimento-para-iniciantes/",
      "estimatedMinutes": 10,
      "quizContentId": null
    }
    // ...
  ]
}

3.3. GET /learning-paths/:id/progress

Nome: GET [Learning] Ver progresso da trilha inteira

Mostra o progresso do usuário em uma trilha.

Exemplo de resposta (real seu)
{
  "learningPathId": "cmi3hrwi20003hvx349f5cw7y",
  "totalSteps": 3,
  "completedStepsIds": [],
  "progressPercent": 0
}

3.4. POST /learning-paths/steps/:stepId/complete

Nome: POST [Learning] Completar passo da trilha

Marca um passo como concluído e retorna progresso + recompensas.

Path params

stepId – ID do passo (cmi3i6m0k000dhvx3ks1nexlk ou desenrola_step_3 etc.)

Body

Para ARTICLE / VIDEO / TOOL: body pode ser vazio {}.

Para QUIZ: opcionalmente enviar algo como:

{
  "answerIndex": 2
}


(o índice da alternativa correta; você adapta conforme já deixou no serviço).

Exemplo de resposta (real seu)
{
  "progress": {
    "id": "cmi83sfoo0003hvymn5x9xmx1",
    "userXPId": "cmi1k88gt0001hv2chygsk450",
    "learningStepId": "cmi3i6m0k000dhvx3ks1nexlk",
    "completedAt": "2025-11-21T00:09:47.111Z"
  },
  "rewards": {
    "xpPoints": 20,
    "xpCoins": 0
  }
}


O front pode usar rewards para animar “+20 XP” na tela.

4. Goals (metas financeiras)

Prefix: /gamification/goals

4.1. GET /gamification/goals/templates

Nome: GET [Goals] Listar templates de metas

Lista os modelos de meta disponíveis.

{
  "goals": [
    {
      "id": "goal_quitar_dividas",
      "title": "Quitar dívidas",
      "description": "Organize suas dívidas e saia do vermelho.",
      "type": "SHORT_TERM",
      "riskLevel": "LOW",
      "recommendedProducts": ["XP Card", "Planilha de dívidas"],
      "iconUrl": "https://example.com/icons/debt.png",
      "xpPointsRewardOnCompletion": 200,
      "xpCoinsRewardOnCompletion": 10
    }
    // ...
  ]
}

4.2. GET /gamification/goals/me

Nome: GET [Goals] Listar minhas metas

Retorna as metas do usuário.

{
  "goals": [
    {
      "id": "user_goal_1",
      "userXPId": "cmi1k88gt0001hv2chygsk450",
      "goalId": "goal_quitar_dividas",
      "customTitle": "Sair do vermelho até março",
      "targetAmount": 5000,
      "currentAmount": 1500,
      "targetDate": "2026-03-01T00:00:00.000Z",
      "recommendedMonthlyDeposit": 625,
      "progressPercent": 30,
      "isActive": true,
      "completedAt": null,
      "xpPointsRewardOnCompletion": 200,
      "xpCoinsRewardOnCompletion": 10,
      "createdAt": "...",
      "updatedAt": "...",
      "goal": {
        "title": "Quitar dívidas",
        "iconUrl": "https://example.com/icons/debt.png"
      }
    }
    // ...
  ]
}

4.3. POST /gamification/goals

Nome:

POST [Goals] Criar meta (template)

POST [Goals] Criar meta (custom)

Usamos um único endpoint; a diferença está no body:

A) Criar meta baseada em template
{
  "templateId": "goal_quitar_dividas",
  "targetAmount": 5000,
  "currentAmount": 0,
  "targetDate": "2026-03-01"
}

B) Criar meta totalmente customizada
{
  "customTitle": "Juntar 10k pra intercâmbio",
  "targetAmount": 10000,
  "currentAmount": 500,
  "targetDate": "2027-01-01"
}


templateId e customTitle são mutuamente exclusivos (fazemos essa validação via Zod).

Exemplo de resposta
{
  "goal": {
    "id": "user_goal_2",
    "userXPId": "cmi1k88gt0001hv2chygsk450",
    "goalId": "goal_quitar_dividas",
    "customTitle": "Sair do vermelho até março",
    "targetAmount": 5000,
    "currentAmount": 0,
    "targetDate": "2026-03-01T00:00:00.000Z",
    "recommendedMonthlyDeposit": 625,
    "progressPercent": 0,
    "isActive": true,
    "completedAt": null,
    "xpPointsRewardOnCompletion": 200,
    "xpCoinsRewardOnCompletion": 10
  }
}

4.4. PATCH /gamification/goals/:id/progress

Nome: PATCH [Goals] Atualizar progresso (parcial, ex: 50%)

Atualiza o quanto o usuário já acumulou para aquela meta e, se bater 100%, entrega XP/coins.

Path params

id – ID da UserGoal.

Body
{
  "currentAmount": 3800
}

Exemplo de resposta
{
  "goal": {
    "id": "user_goal_2",
    "currentAmount": 3800,
    "progressPercent": 76,
    "isActive": true,
    "completedAt": null
  }
}


Quando progressPercent passa de 100%, o backend:

trava em 100%,

marca completedAt,

chama UserXPGamificationService pra somar XP / coins.

5. Gamification Overview
5.1. GET /gamification/overview

Nome: GET [Gamification] Overview

Resposta real que você já obteve:

{
  "user": {
    "id": "cmi1k88gt0001hv2chygsk450",
    "username": "teste+1",
    "avatarUrl": null,
    "totalXp": 190,
    "currentLevel": "Budget Explorer",
    "xpToNextLevel": 110,
    "xpCoinsBalance": 10,
    "dayStreak": 0
  },
  "financialProfile": {
    "hasProfile": true,
    "overallScore": 375,
    "desenrolaScore": 500,
    "organizaScore": 0,
    "reservaScore": 500,
    "investeScore": 500,
    "hasCompletedOnboarding": true
  },
  "learning": {
    "completedStepsCount": 4
  },
  "goals": {
    "activeGoalsCount": 8,
    "completedGoalsCount": 1
  },
  "challenges": {
    "availableChallengesCount": 2,
    "activeChallengesCount": 0,
    "completedChallengesCount": 1
  }
}


Essa é a rota principal pra home gamificada: um GET aqui já abastece praticamente todos os cards da tela inicial.

6. Challenges (desafios)

Prefix: /gamification/challenges

6.1. GET /gamification/challenges

Nome: GET [Challenges] Listar desafios com meu progresso

Lista todos os desafios cadastrados + progresso (se existir) para o userXP atual.

Exemplo de resposta (real seu)
{
  "challenges": [
    {
      "challenge": {
        "id": "challenge_check_app_5_days",
        "title": "5 dias seguidos abrindo o XP GamePlan",
        "description": "Entre no app por 5 dias seguidos.",
        "challengeType": "DAILY",
        "durationDays": 5,
        "xpPointsReward": 100,
        "xpCoinsReward": 5,
        "badgeId": null,
        "iconUrl": "https://example.com/challenges/streak.png",
        "createdAt": "2025-11-20T20:33:29.914Z",
        "updatedAt": "2025-11-20T20:33:29.914Z"
      },
      "progress": null,
      "progressPercent": 0
    },
    {
      "challenge": {
        "id": "challenge_no_food_delivery_7_days",
        "title": "7 dias sem delivery",
        "description": "Passe 7 dias sem pedir comida por aplicativos.",
        "challengeType": "WEEKLY",
        "durationDays": 7,
        "xpPointsReward": 150,
        "xpCoinsReward": 10,
        "badgeId": "badge_debt_fighter",
        "iconUrl": "https://example.com/challenges/no-delivery.png",
        "createdAt": "2025-11-20T20:33:29.912Z",
        "updatedAt": "2025-11-20T20:33:29.912Z"
      },
      "progress": null,
      "progressPercent": 0
    }
  ]
}


progressPercent é calculado com base em currentProgress vs durationDays.

6.2. PATCH /gamification/challenges/:challengeId/progress

Nome: PATCH [Challenges] Atualizar progresso de um desafio

Atualiza o progresso do usuário em um desafio e, se completar, pode entregar XP/coins e badge.

Path params

challengeId – ex: "challenge_no_food_delivery_7_days"

Body
{
  "currentProgress": 3,
  "isCompleted": false
}


O backend pode recalcular isCompleted quando currentProgress >= durationDays; o campo no body é mais para forçar completude em alguns casos, depende de como você deixou no service.

Exemplo de resposta (real seu)
{
  "progress": {
    "id": "cmi8unfd50001hvi59g43p4li",
    "userXPId": "cmi1k88gt0001hv2chygsk450",
    "challengeId": "challenge_no_food_delivery_7_days",
    "startDate": "2025-11-21T12:41:43.049Z",
    "endDate": "2025-11-28T12:41:43.049Z",
    "currentProgress": 3,
    "isCompleted": false,
    "completedAt": null
  }
}


Depois que você completar (isCompleted: true ou progress >= durationDays), o service também chama gamificação para adicionar XP / coins e, se existir badge (badgeId), cria um registro em UserBadge.

7. Dica de uso no front

Quando o usuário entra no app após login:

Chamar GET /gamification/overview

Preencher cards principais (XP, nível, metas ativas, desafios, etc.)

Para cards clicáveis:

Metas → GET /gamification/goals/me

Desafios → GET /gamification/challenges

Trilhas → GET /learning-paths/recommended

Ao finalizar ações:

Completar passo → POST /learning-paths/steps/:stepId/complete

Atualizar meta → PATCH /gamification/goals/:id/progress

Atualizar desafio → PATCH /gamification/challenges/:challengeId/progress