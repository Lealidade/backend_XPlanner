// goal – Templates de metas

const SEED_GOALS = [
    // DESENROLA
    {
        title: "Quitar dívidas",
        description: "Organize suas dívidas e saia do vermelho.",
        type: "SHORT_TERM",
        riskLevel: "LOW",
        dimension: "DESENROLA",
        category: "OTHER",
        recommendedProducts: ["XP Card", "Planilha de dívidas"],
        iconUrl: "https://example.com/icons/debt.png",
        xpPointsRewardOnCompletion: 200,
        xpCoinsRewardOnCompletion: 10,
    },
    {
        title: "Montar plano de quitação do cartão",
        description:
            "Monte um plano de pagamento para reduzir o rotativo do cartão de crédito.",
        type: "SHORT_TERM",
        riskLevel: "LOW",
        dimension: "DESENROLA",
        category: "OTHER",
        recommendedProducts: ["XP Card", "Planilha de cartão de crédito"],
        iconUrl: "https://example.com/icons/credit-card.png",
        xpPointsRewardOnCompletion: 220,
        xpCoinsRewardOnCompletion: 12,
    },

    // RESERVA
    {
        title: "Reserva de Emergência",
        description: "Monte uma reserva de 3 a 6 meses do seu custo de vida.",
        type: "MEDIUM_TERM",
        riskLevel: "LOW",
        dimension: "RESERVA",
        category: "OTHER",
        recommendedProducts: ["Tesouro Selic", "CDB Liquidez Diária"],
        iconUrl: "https://example.com/icons/emergency.png",
        xpPointsRewardOnCompletion: 300,
        xpCoinsRewardOnCompletion: 15,
    },
    {
        title: "Aumentar reserva em 1 salário",
        description:
            "Dê o próximo passo e aumente sua reserva em pelo menos 1 mês de gastos.",
        type: "MEDIUM_TERM",
        riskLevel: "LOW",
        dimension: "RESERVA",
        category: "OTHER",
        recommendedProducts: ["Tesouro Selic", "Fundos DI"],
        iconUrl: "https://example.com/icons/emergency-plus.png",
        xpPointsRewardOnCompletion: 320,
        xpCoinsRewardOnCompletion: 16,
    },

    // ORGANIZA
    {
        title: "Gastar melhor no cartão de crédito",
        description:
            "Organize seus gastos no cartão para não se enrolar no fim do mês.",
        type: "SHORT_TERM",
        riskLevel: "LOW",
        dimension: "ORGANIZA",
        category: "OTHER",
        recommendedProducts: ["Planilha de orçamento", "XP Card"],
        iconUrl: "https://example.com/icons/budget-card.png",
        xpPointsRewardOnCompletion: 180,
        xpCoinsRewardOnCompletion: 8,
    },
    {
        title: "Montar orçamento mensal",
        description:
            "Defina categorias de gastos e um teto mensal para cada uma.",
        type: "SHORT_TERM",
        riskLevel: "LOW",
        dimension: "ORGANIZA",
        category: "OTHER",
        recommendedProducts: ["Planilha de orçamento", "XP App"],
        iconUrl: "https://example.com/icons/budget.png",
        xpPointsRewardOnCompletion: 200,
        xpCoinsRewardOnCompletion: 10,
    },

    // INVESTE
    {
        title: "Investir no primeiro fundo imobiliário",
        description: "Dê o primeiro passo no mundo dos FIIs.",
        type: "LONG_TERM",
        riskLevel: "MEDIUM",
        dimension: "INVESTE",
        category: "OTHER",
        recommendedProducts: ["FIIs XP"],
        iconUrl: "https://example.com/icons/realestate.png",
        xpPointsRewardOnCompletion: 400,
        xpCoinsRewardOnCompletion: 20,
    },
    {
        title: "Primeiro investimento em renda fixa",
        description: "Comece a investir com segurança em renda fixa simples.",
        type: "MEDIUM_TERM",
        riskLevel: "LOW",
        dimension: "INVESTE",
        category: "OTHER",
        recommendedProducts: ["CDB", "Tesouro Direto"],
        iconUrl: "https://example.com/icons/bond.png",
        xpPointsRewardOnCompletion: 260,
        xpCoinsRewardOnCompletion: 12,
    },
    {
        title: "Investir todo mês automaticamente",
        description:
            "Defina um valor mensal para investir e automatize seus aportes.",
        type: "LONG_TERM",
        riskLevel: "MEDIUM",
        dimension: "INVESTE",
        category: "OTHER",
        recommendedProducts: ["Agendamentos XP", "Fundos de investimento"],
        iconUrl: "https://example.com/icons/monthly-invest.png",
        xpPointsRewardOnCompletion: 420,
        xpCoinsRewardOnCompletion: 22,
    },
];

// quizQuestion + quizOption – Quiz diagnóstico

const SEED_QUIZ_QUESTIONS = [
    {
        id: "diagnostic_desenrola_1",
        text: "Você sente que suas dívidas estão sob controle?",
        dimension: "DESENROLA",
        order: 1,
        isActive: true,
    },
    {
        id: "diagnostic_reserva_1",
        text: "Você já tem uma reserva de emergência montada?",
        dimension: "RESERVA",
        order: 2,
        isActive: true,
    },
    {
        id: "diagnostic_organiza_1",
        text: "Você acompanha seus gastos mensalmente?",
        dimension: "ORGANIZA",
        order: 3,
        isActive: true,
    },
    {
        id: "diagnostic_investe_1",
        text: "Você já investe com regularidade?",
        dimension: "INVESTE",
        order: 4,
        isActive: true,
    },
];

const SEED_QUIZ_OPTIONS = [
    // diagnostic_desenrola_1
    {
        questionId: "diagnostic_desenrola_1",
        label: "Sim, totalmente sob controle",
        weight: 3,
        explanation: "Ótimo! Manter as dívidas sob controle é o primeiro passo.",
    },
    {
        questionId: "diagnostic_desenrola_1",
        label: "Mais ou menos, às vezes me perco",
        weight: 0,
        explanation: "Já é um começo, mas dá pra melhorar com organização.",
    },
    {
        questionId: "diagnostic_desenrola_1",
        label: "Não, estou bem enrolado(a)",
        weight: -3,
        explanation: "Calma! Vamos te ajudar a desenrolar isso.",
    },

    // diagnostic_reserva_1
    {
        questionId: "diagnostic_reserva_1",
        label: "Sim, de 3 a 6 meses de gastos",
        weight: 3,
    },
    {
        questionId: "diagnostic_reserva_1",
        label: "Tenho algo, mas menos de 3 meses",
        weight: 1,
    },
    {
        questionId: "diagnostic_reserva_1",
        label: "Ainda não comecei",
        weight: -2,
    },

    // diagnostic_organiza_1
    {
        questionId: "diagnostic_organiza_1",
        label: "Sim, anoto tudo e reviso todo mês",
        weight: 3,
    },
    {
        questionId: "diagnostic_organiza_1",
        label: "Anoto algumas coisas, mas sem muita frequência",
        weight: 1,
    },
    {
        questionId: "diagnostic_organiza_1",
        label: "Não, nunca acompanho meus gastos",
        weight: -2,
    },

    // diagnostic_investe_1
    {
        questionId: "diagnostic_investe_1",
        label: "Sim, invisto todo mês",
        weight: 3,
    },
    {
        questionId: "diagnostic_investe_1",
        label: "Invisto às vezes, quando sobra",
        weight: 1,
    },
    {
        questionId: "diagnostic_investe_1",
        label: "Ainda não comecei a investir",
        weight: -2,
    },
];

// Learning Paths

const SEED_LEARNING_PATHS = [
    {
        slug: "organiza_comeco",
        title: "Comece organizando seu mês",
        description:
            "Primeira trilha para entender para onde está indo o seu dinheiro e montar um orçamento simples e realista.",
        dimension: "ORGANIZA",
        level: "BASIC",
        estimatedMinutes: 25,
        imageUrl: "https://example.com/images/organiza.png",
        totalSteps: 3,
        isActive: true,
        order: 1,
    },
    {
        slug: "organiza_gastos_flexiveis",
        title: "Domine gastos fixos e variáveis",
        description:
            "Aprenda a separar gastos essenciais dos supérfluos e identificar onde cortar.",
        dimension: "ORGANIZA",
        level: "BASIC",
        estimatedMinutes: 20,
        imageUrl: "https://example.com/images/organiza-2.png",
        totalSteps: 3,
        isActive: true,
        order: 2,
    },
    {
        slug: "desenrola-dividas",
        title: "Desenrola: Organizando as Dívidas",
        description:
            "Aprenda passo a passo como mapear, priorizar e quitar suas dívidas.",
        dimension: "DESENROLA",
        level: "BASIC",
        estimatedMinutes: 30,
        imageUrl: "https://example.com/images/path-desenrola.png",
        totalSteps: 3,
        isActive: true,
        order: 3,
    },
    {
        slug: "reserva_emergencia_basico",
        title: "Construa sua reserva de emergência",
        description:
            "Passo a passo para entender o que é reserva de emergência, quanto guardar e onde investir com segurança.",
        dimension: "RESERVA",
        level: "BASIC",
        estimatedMinutes: 30,
        imageUrl: "https://example.com/images/reserva.png",
        totalSteps: 3,
        isActive: true,
        order: 4,
    },
    {
        slug: "reserva_avancando",
        title: "Dobrando a reserva de emergência",
        description:
            "Saia do básico e aprenda como continuar fortalecendo sua reserva com segurança.",
        dimension: "RESERVA",
        level: "BASIC",
        estimatedMinutes: 25,
        imageUrl: "https://example.com/images/reserva-2.png",
        totalSteps: 3,
        isActive: true,
        order: 5,
    },
    {
        slug: "investe_iniciantes_seguro",
        title: "Comece a investir com segurança",
        description:
            "Trilha para quem está dando os primeiros passos nos investimentos e quer montar uma base sólida e segura.",
        dimension: "INVESTE",
        level: "BASIC",
        estimatedMinutes: 35,
        imageUrl: "https://example.com/images/investe.png",
        totalSteps: 3,
        isActive: true,
        order: 6,
    },
    {
        slug: "investe_renda_fixa",
        title: "Renda fixa na prática",
        description:
            "Entenda como funcionam CDB, Tesouro Direto e fundos de renda fixa.",
        dimension: "INVESTE",
        level: "BASIC",
        estimatedMinutes: 30,
        imageUrl: "https://example.com/images/renda-fixa.png",
        totalSteps: 3,
        isActive: true,
        order: 7,
    },
];

// Steps de cada trilha

// (gpt) Aqui eu uso learningPathSlug só pra visualizar; no banco é learningPathId (foreign key).

const SEED_LEARNING_STEPS = [
    // organiza_comeco
    {
        learningPathSlug: "organiza_comeco",
        order: 1,
        title: "Por que planejamento financeiro importa de verdade?",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/planejamento-financeiro/",
        estimatedMinutes: 8,
    },
    {
        learningPathSlug: "organiza_comeco",
        order: 2,
        title: "Monte seu orçamento com uma planilha de gastos",
        type: "TOOL",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/planilha-de-gastos/",
        estimatedMinutes: 10,
    },
    {
        learningPathSlug: "organiza_comeco",
        order: 3,
        title: "Orçamento familiar simples na prática",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/orcamento-familiar/",
        estimatedMinutes: 7,
    },

    // organiza_gastos_flexiveis
    {
        learningPathSlug: "organiza_gastos_flexiveis",
        order: 1,
        title: "Gastos fixos x variáveis: qual a diferença?",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/gastos-fixos-variaveis",
        estimatedMinutes: 7,
    },
    {
        learningPathSlug: "organiza_gastos_flexiveis",
        order: 2,
        title: "Como reduzir gastos supérfluos sem sofrer",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/reduzir-gastos-superfluos",
        estimatedMinutes: 8,
    },
    {
        learningPathSlug: "organiza_gastos_flexiveis",
        order: 3,
        title: "Checklist mensal de revisão de gastos",
        type: "TOOL",
        xpContentUrl: "https://conteudos.xpi.com.br/checklist-gastos",
        estimatedMinutes: 5,
    },

    // desenrola-dividas
    {
        learningPathSlug: "desenrola-dividas",
        order: 1,
        title: "Mapeando todas suas dívidas",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xp.com.br/mapeando-dividas",
        estimatedMinutes: 10,
    },
    {
        learningPathSlug: "desenrola-dividas",
        order: 2,
        title: "Priorizando o que pagar primeiro",
        type: "VIDEO",
        xpContentUrl: "https://conteudos.xp.com.br/video-priorizando-dividas",
        estimatedMinutes: 10,
    },
    {
        learningPathSlug: "desenrola-dividas",
        order: 3,
        title: "Teste rápido: você entendeu o plano?",
        type: "QUIZ",
        estimatedMinutes: 10,
        quizContentId: "desenrola_step_3_quiz",
    },

    // reserva_emergencia_basico
    {
        learningPathSlug: "reserva_emergencia_basico",
        order: 1,
        title:
            "O que é reserva de emergência e por que você precisa dela",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/reserva-de-emergencia/",
        estimatedMinutes: 8,
    },
    {
        learningPathSlug: "reserva_emergencia_basico",
        order: 2,
        title: "7 melhores investimentos para reserva de emergência",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimentos-para-reserva-de-emergencia/",
        estimatedMinutes: 10,
    },
    {
        learningPathSlug: "reserva_emergencia_basico",
        order: 3,
        title: "Conheça o Fundo XP 24 Horas para sua reserva",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/fundo-xp-24-horas/",
        estimatedMinutes: 10,
    },

    // reserva_avancando
    {
        learningPathSlug: "reserva_avancando",
        order: 1,
        title: "Quanto é suficiente para a sua realidade?",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/quanto-guardar",
        estimatedMinutes: 8,
    },
    {
        learningPathSlug: "reserva_avancando",
        order: 2,
        title: "Reforçando a reserva com aportes mensais",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/aportes-mensais",
        estimatedMinutes: 8,
    },
    {
        learningPathSlug: "reserva_avancando",
        order: 3,
        title: "Como não usar a reserva para qualquer gasto",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/nao-usar-reserva",
        estimatedMinutes: 9,
    },

    // investe_iniciantes_seguro
    {
        learningPathSlug: "investe_iniciantes_seguro",
        order: 1,
        title: "Investimentos para iniciantes: 9 opções pra começar",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimento-para-iniciantes/",
        estimatedMinutes: 10,
    },
    {
        learningPathSlug: "investe_iniciantes_seguro",
        order: 2,
        title: "Educação financeira: conceitos básicos pra ganhar confiança",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/educacao-financeira/",
        estimatedMinutes: 8,
    },
    {
        learningPathSlug: "investe_iniciantes_seguro",
        order: 3,
        title: "Liberdade financeira: 7 passos para sua autonomia",
        type: "ARTICLE",
        xpContentUrl:
            "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/liberdade-financeira/",
        estimatedMinutes: 12,
    },

    // investe_renda_fixa
    {
        learningPathSlug: "investe_renda_fixa",
        order: 1,
        title: "O que é renda fixa e por que começar por ela",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/o-que-e-renda-fixa",
        estimatedMinutes: 9,
    },
    {
        learningPathSlug: "investe_renda_fixa",
        order: 2,
        title: "Tesouro Direto x CDB: diferenças principais",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/tesouro-direto-x-cdb",
        estimatedMinutes: 10,
    },
    {
        learningPathSlug: "investe_renda_fixa",
        order: 3,
        title: "Fundos de renda fixa: como avaliar",
        type: "ARTICLE",
        xpContentUrl: "https://conteudos.xpi.com.br/fundos-renda-fixa",
        estimatedMinutes: 11,
    },
];

// Conteúdo de quiz (quizContent)

const SEED_QUIZ_CONTENT = [
    {
        id: "desenrola_step_3_quiz",
        questionText:
            "Qual das opções representa melhor uma boa estratégia para quitar dívidas?",
        options: [
            "Pagar só o mínimo do cartão e seguir a vida",
            "Ignorar as dívidas até “sobrar dinheiro”",
            "Listar todas as dívidas, priorizar as mais caras e negociar juros",
        ],
        correctAnswerIndex: 2,
        explanation:
            "Atacar primeiro as dívidas com juros mais altos reduz o custo total.",
        xpPointsReward: 50,
        xpCoinsReward: 5,
    },
];

// badge – Conquistas

const SEED_BADGES = [
    {
        id: "badge_debt_fighter",
        name: "Debt Fighter",
        description: "Conquistada ao completar seu primeiro desafio de dívidas.",
        iconUrl: "https://example.com/badges/debt-fighter.png",
        criteria: "Complete um desafio da dimensão Desenrola.",
    },
    {
        id: "badge_budget_master",
        name: "Budget Master",
        description: "Conquistada ao concluir trilhas da dimensão Organiza.",
        iconUrl: "https://example.com/badges/budget-master.png",
        criteria: "Complete uma trilha de organização de gastos.",
    },
    {
        id: "badge_emergency_ready",
        name: "Emergency Ready",
        description: "Conquistada ao concluir trilhas de reserva de emergência.",
        iconUrl: "https://example.com/badges/emergency-ready.png",
        criteria: "Complete uma trilha da dimensão Reserva.",
    },
    {
        id: "badge_first_investment",
        name: "First Investment",
        description:
            "Conquistada ao completar sua primeira trilha de investimentos.",
        iconUrl: "https://example.com/badges/first-investment.png",
        criteria: "Complete uma trilha da dimensão Investe.",
    },
];

// challenge – Desafios gamificados

const SEED_CHALLENGES = [
    {
        id: "challenge_no_food_delivery_7_days",
        title: "7 dias sem delivery",
        description: "Passe 7 dias sem pedir comida por aplicativos.",
        challengeType: "WEEKLY",
        durationDays: 7,
        xpPointsReward: 150,
        xpCoinsReward: 10,
        badgeId: "badge_debt_fighter",
        iconUrl: "https://example.com/challenges/no-delivery.png",
    },
    {
        id: "challenge_check_app_5_days",
        title: "5 dias seguidos abrindo o XP GamePlan",
        description: "Entre no app por 5 dias seguidos.",
        challengeType: "DAILY",
        durationDays: 5,
        xpPointsReward: 100,
        xpCoinsReward: 5,
        badgeId: null,
        iconUrl: "https://example.com/challenges/streak.png",
    },
    {
        id: "challenge_track_expenses_7_days",
        title: "7 dias anotando gastos",
        description: "Anote todos os seus gastos por 7 dias consecutivos.",
        challengeType: "DAILY",
        durationDays: 7,
        xpPointsReward: 180,
        xpCoinsReward: 12,
        badgeId: "badge_budget_master",
        iconUrl: "https://example.com/challenges/track-expenses.png",
    },
    {
        id: "challenge_build_emergency_fund",
        title: "Primeira meta da reserva",
        description:
            "Guarde pelo menos meio mês de gastos na sua reserva de emergência.",
        challengeType: "WEEKLY",
        durationDays: 30,
        xpPointsReward: 250,
        xpCoinsReward: 20,
        badgeId: "badge_emergency_ready",
        iconUrl: "https://example.com/challenges/emergency-fund.png",
    },
    {
        id: "challenge_first_investment",
        title: "Seu primeiro investimento",
        description:
            "Abra sua primeira posição em um investimento de renda fixa.",
        challengeType: "WEEKLY",
        durationDays: 14,
        xpPointsReward: 220,
        xpCoinsReward: 18,
        badgeId: "badge_first_investment",
        iconUrl: "https://example.com/challenges/first-invest.png",
    },
];
