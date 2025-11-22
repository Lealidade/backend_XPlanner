// import { injectable, inject } from "tsyringe";
// import { ILearningStepRepository } from "../data/interfaces/ILearningStepRepository";
// import { IUserLearningStepProgressRepository } from "../data/interfaces/IUserLearningStepProgressRepository";

// interface IRequest {
//     userXPId: string;
//     stepId: string;
// }

// export interface LearningPathProgressDTO {
//     learningPathId: string;
//     totalSteps: number;
//     completedStepsIds: string[];
//     progressPercent: number;
// }

// @injectable()
// export class MarkLearningStepCompletedService {
//     constructor(
//         @inject("LearningStepRepository")
//         private learningStepRepository: ILearningStepRepository,

//         @inject("UserLearningStepProgressRepository")
//         private userLearningStepProgressRepository: IUserLearningStepProgressRepository,
//     ) { }

//     public async execute({
//         userXPId,
//         stepId,
//     }: IRequest): Promise<LearningPathProgressDTO> {
//         const step = await this.learningStepRepository.findByIdWithPathAndSteps(
//             stepId,
//         );

//         if (!step) {
//             throw new Error("LEARNING_STEP_NOT_FOUND");
//         }

//         const learningPath = step.learningPath;
//         const totalSteps = learningPath.steps.length;

//         if (totalSteps === 0) {
//             return {
//                 learningPathId: learningPath.id,
//                 totalSteps: 0,
//                 completedStepsIds: [],
//                 progressPercent: 0,
//             };
//         }

//         await this.userLearningStepProgressRepository.markAsCompleted(
//             userXPId,
//             stepId,
//         );

//         const completedStepsIds =
//             await this.userLearningStepProgressRepository.findCompletedStepIdsByUserAndPath(
//                 userXPId,
//                 learningPath.id,
//             );

//         const completedCount = completedStepsIds.length;
//         const progressPercent = Math.round((completedCount / totalSteps) * 100);

//         return {
//             learningPathId: learningPath.id,
//             totalSteps,
//             completedStepsIds,
//             progressPercent,
//         };
//     }
// }
