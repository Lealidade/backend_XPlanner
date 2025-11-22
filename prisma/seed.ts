// // prisma/seed.ts
// import "dotenv/config";
// import {
//     PrismaClient,
//     FinancialDimension,
//     GoalType,
//     RiskLevel,
//     LearningPathLevel,
//     LearningContentType,
//     ChallengeType,
// } from "../src/generated/prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//     console.log("🌱 Seeding database...");

//     // -------------------------------------------------
//     // 1) GOALS (templates de metas financeiras)
//     // -------------------------------------------------
//     await prisma.goal.createMany({
//         data: [
//             {
//                 title: "Quitar dívidas",
//                 description: "Organize suas dívidas e saia do vermelho.",
//                 type: GoalType.SHORT_TERM,
//                 riskLevel: RiskLevel.LOW,
//                 recommendedProducts: ["XP Card", "Planilha de dívidas"],
//                 iconUrl: "https://example.com/icons/debt.png",
//                 xpPointsRewardOnCompletion: 200,
//                 xpCoinsRewardOnCompletion: 10,
//             },
//             {
//                 title: "Reserva de Emergência",
//                 description: "Monte uma reserva de 3 a 6 meses do seu custo de vida.",
//                 type: GoalType.MEDIUM_TERM,
//                 riskLevel: RiskLevel.LOW,
//                 recommendedProducts: ["Tesouro Selic", "CDB Liquidez Diária"],
//                 iconUrl: "https://example.com/icons/emergency.png",
//                 xpPointsRewardOnCompletion: 300,
//                 xpCoinsRewardOnCompletion: 15,
//             },
//             {
//                 title: "Investir no primeiro fundo imobiliário",
//                 description: "Dê o primeiro passo no mundo dos FIIs.",
//                 type: GoalType.LONG_TERM,
//                 riskLevel: RiskLevel.MEDIUM,
//                 recommendedProducts: ["FIIs XP"],
//                 iconUrl: "https://example.com/icons/realestate.png",
//                 xpPointsRewardOnCompletion: 400,
//                 xpCoinsRewardOnCompletion: 20,
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // -------------------------------------------------
//     // 2) QUIZ DIAGNÓSTICO (Onboarding)
//     // -------------------------------------------------
//     const q1 = await prisma.quizQuestion.upsert({
//         where: { id: "diagnostic_desenrola_1" },
//         update: {},
//         create: {
//             id: "diagnostic_desenrola_1",
//             text: "Você sente que suas dívidas estão sob controle?",
//             dimension: FinancialDimension.DESENROLA,
//             order: 1,
//             isActive: true,
//         },
//     });

//     await prisma.quizOption.createMany({
//         data: [
//             {
//                 questionId: q1.id,
//                 label: "Sim, totalmente sob controle",
//                 weight: 3,
//                 explanation:
//                     "Ótimo! Manter as dívidas sob controle é o primeiro passo.",
//             },
//             {
//                 questionId: q1.id,
//                 label: "Mais ou menos, às vezes me perco",
//                 weight: 0,
//                 explanation:
//                     "Já é um começo, mas dá pra melhorar com organização.",
//             },
//             {
//                 questionId: q1.id,
//                 label: "Não, estou bem enrolado(a)",
//                 weight: -3,
//                 explanation: "Calma! Vamos te ajudar a desenrolar isso.",
//             },
//         ],
//         skipDuplicates: true,
//     });

//     const q2 = await prisma.quizQuestion.upsert({
//         where: { id: "diagnostic_reserva_1" },
//         update: {},
//         create: {
//             id: "diagnostic_reserva_1",
//             text: "Você já tem uma reserva de emergência montada?",
//             dimension: FinancialDimension.RESERVA,
//             order: 2,
//             isActive: true,
//         },
//     });

//     await prisma.quizOption.createMany({
//         data: [
//             {
//                 questionId: q2.id,
//                 label: "Sim, de 3 a 6 meses de gastos",
//                 weight: 3,
//             },
//             {
//                 questionId: q2.id,
//                 label: "Tenho algo, mas menos de 3 meses",
//                 weight: 1,
//             },
//             {
//                 questionId: q2.id,
//                 label: "Ainda não comecei",
//                 weight: -2,
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // -------------------------------------------------
//     // 3) LEARNING PATHS (várias trilhas)
//     // -------------------------------------------------

//     // 3.1 – Organiza: Comece organizando seu mês
//     const organizaPath = await prisma.learningPath.upsert({
//         where: { slug: "organiza_comeco" },
//         update: {},
//         create: {
//             slug: "organiza_comeco",
//             title: "Comece organizando seu mês",
//             description:
//                 "Primeira trilha para entender para onde está indo o seu dinheiro e montar um orçamento simples e realista.",
//             dimension: FinancialDimension.ORGANIZA,
//             level: LearningPathLevel.BASIC,
//             estimatedMinutes: 25,
//             imageUrl: "https://example.com/images/organiza.png",
//             totalSteps: 3,
//             isActive: true,
//             order: 1,
//         },
//     });

//     await prisma.learningStep.createMany({
//         data: [
//             {
//                 learningPathId: organizaPath.id,
//                 order: 1,
//                 title: "Por que planejamento financeiro importa de verdade?",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/planejamento-financeiro/",
//                 estimatedMinutes: 8,
//             },
//             {
//                 learningPathId: organizaPath.id,
//                 order: 2,
//                 title: "Monte seu orçamento com uma planilha de gastos",
//                 type: LearningContentType.TOOL,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/planilha-de-gastos/",
//                 estimatedMinutes: 10,
//             },
//             {
//                 learningPathId: organizaPath.id,
//                 order: 3,
//                 title: "Orçamento familiar simples na prática",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/orcamento-familiar/",
//                 estimatedMinutes: 7,
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // 3.2 – Desenrola: Organizando as Dívidas (a que você já tinha)
//     const desenrolaPath = await prisma.learningPath.upsert({
//         where: { slug: "desenrola-dividas" },
//         update: {},
//         create: {
//             slug: "desenrola-dividas",
//             title: "Desenrola: Organizando as Dívidas",
//             description:
//                 "Aprenda passo a passo como mapear, priorizar e quitar suas dívidas.",
//             dimension: FinancialDimension.DESENROLA,
//             level: LearningPathLevel.BASIC,
//             estimatedMinutes: 30,
//             imageUrl: "https://example.com/images/path-desenrola.png",
//             totalSteps: 3,
//             isActive: true,
//             order: 2,
//         },
//     });

//     const quizContent = await prisma.quizContent.upsert({
//         where: { id: "desenrola_step_3_quiz" },
//         update: {},
//         create: {
//             id: "desenrola_step_3_quiz",
//             questionText:
//                 "Qual das opções representa melhor uma boa estratégia para quitar dívidas?",
//             options: [
//                 "Pagar só o mínimo do cartão e seguir a vida",
//                 "Ignorar as dívidas até “sobrar dinheiro”",
//                 "Listar todas as dívidas, priorizar as mais caras e negociar juros",
//             ],
//             correctAnswerIndex: 2,
//             explanation:
//                 "Atacar primeiro as dívidas com juros mais altos reduz o custo total.",
//             xpPointsReward: 50,
//             xpCoinsReward: 5,
//         },
//     });

//     await prisma.learningStep.createMany({
//         data: [
//             {
//                 learningPathId: desenrolaPath.id,
//                 order: 1,
//                 title: "Mapeando todas suas dívidas",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl: "https://conteudos.xp.com.br/mapeando-dividas",
//                 estimatedMinutes: 10,
//             },
//             {
//                 learningPathId: desenrolaPath.id,
//                 order: 2,
//                 title: "Priorizando o que pagar primeiro",
//                 type: LearningContentType.VIDEO,
//                 xpContentUrl:
//                     "https://conteudos.xp.com.br/video-priorizando-dividas",
//                 estimatedMinutes: 10,
//             },
//             {
//                 learningPathId: desenrolaPath.id,
//                 order: 3,
//                 title: "Teste rápido: você entendeu o plano?",
//                 type: LearningContentType.QUIZ,
//                 estimatedMinutes: 10,
//                 quizContentId: quizContent.id,
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // 3.3 – Reserva de emergência
//     const reservaPath = await prisma.learningPath.upsert({
//         where: { slug: "reserva_emergencia_basico" },
//         update: {},
//         create: {
//             slug: "reserva_emergencia_basico",
//             title: "Construa sua reserva de emergência",
//             description:
//                 "Passo a passo para entender o que é reserva de emergência, quanto guardar e onde investir com segurança.",
//             dimension: FinancialDimension.RESERVA,
//             level: LearningPathLevel.BASIC,
//             estimatedMinutes: 30,
//             imageUrl: "https://example.com/images/reserva.png",
//             totalSteps: 3,
//             isActive: true,
//             order: 3,
//         },
//     });

//     await prisma.learningStep.createMany({
//         data: [
//             {
//                 learningPathId: reservaPath.id,
//                 order: 1,
//                 title:
//                     "O que é reserva de emergência e por que você precisa dela",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/reserva-de-emergencia/",
//                 estimatedMinutes: 8,
//             },
//             {
//                 learningPathId: reservaPath.id,
//                 order: 2,
//                 title:
//                     "7 melhores investimentos para reserva de emergência",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimentos-para-reserva-de-emergencia/",
//                 estimatedMinutes: 10,
//             },
//             {
//                 learningPathId: reservaPath.id,
//                 order: 3,
//                 title:
//                     "Conheça o Fundo XP 24 Horas para sua reserva",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/fundo-xp-24-horas/",
//                 estimatedMinutes: 10,
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // 3.4 – Investe: iniciantes
//     const investePath = await prisma.learningPath.upsert({
//         where: { slug: "investe_iniciantes_seguro" },
//         update: {},
//         create: {
//             slug: "investe_iniciantes_seguro",
//             title: "Comece a investir com segurança",
//             description:
//                 "Trilha para quem está dando os primeiros passos nos investimentos e quer montar uma base sólida e segura.",
//             dimension: FinancialDimension.INVESTE,
//             level: LearningPathLevel.BASIC,
//             estimatedMinutes: 35,
//             imageUrl: "https://example.com/images/investe.png",
//             totalSteps: 3,
//             isActive: true,
//             order: 4,
//         },
//     });

//     await prisma.learningStep.createMany({
//         data: [
//             {
//                 learningPathId: investePath.id,
//                 order: 1,
//                 title: "Investimentos para iniciantes: 9 opções pra começar",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/investimento-para-iniciantes/",
//                 estimatedMinutes: 10,
//             },
//             {
//                 learningPathId: investePath.id,
//                 order: 2,
//                 title:
//                     "Educação financeira: conceitos básicos pra ganhar confiança",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/educacao-financeira/",
//                 estimatedMinutes: 8,
//             },
//             {
//                 learningPathId: investePath.id,
//                 order: 3,
//                 title:
//                     "Liberdade financeira: 7 passos para sua autonomia",
//                 type: LearningContentType.ARTICLE,
//                 xpContentUrl:
//                     "https://conteudos.xpi.com.br/aprenda-a-investir/relatorios/liberdade-financeira/",
//                 estimatedMinutes: 12,
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // -------------------------------------------------
//     // 4) BADGES
//     // -------------------------------------------------
//     const debtFighterBadge = await prisma.badge.upsert({
//         where: { id: "badge_debt_fighter" },
//         update: {},
//         create: {
//             id: "badge_debt_fighter",
//             name: "Debt Fighter",
//             description:
//                 "Conquistada ao completar seu primeiro desafio de dívidas.",
//             iconUrl: "https://example.com/badges/debt-fighter.png",
//             criteria: "Complete um desafio da dimensão Desenrola.",
//         },
//     });

//     // -------------------------------------------------
//     // 5) CHALLENGES
//     // -------------------------------------------------
//     await prisma.challenge.upsert({
//         where: { id: "challenge_no_food_delivery_7_days" },
//         update: {},
//         create: {
//             id: "challenge_no_food_delivery_7_days",
//             title: "7 dias sem delivery",
//             description: "Passe 7 dias sem pedir comida por aplicativos.",
//             challengeType: ChallengeType.WEEKLY,
//             durationDays: 7,
//             xpPointsReward: 150,
//             xpCoinsReward: 10,
//             badgeId: debtFighterBadge.id,
//             iconUrl: "https://example.com/challenges/no-delivery.png",
//         },
//     });

//     await prisma.challenge.upsert({
//         where: { id: "challenge_check_app_5_days" },
//         update: {},
//         create: {
//             id: "challenge_check_app_5_days",
//             title: "5 dias seguidos abrindo o XP GamePlan",
//             description: "Entre no app por 5 dias seguidos.",
//             challengeType: ChallengeType.DAILY,
//             durationDays: 5,
//             xpPointsReward: 100,
//             xpCoinsReward: 5,
//             badgeId: null,
//             iconUrl: "https://example.com/challenges/streak.png",
//         },
//     });

//     console.log("✅ Seed finished!");
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });
