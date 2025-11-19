export interface ICreateUserQuizAnswerDTO {
    userXPId: string;
    questionId: string;
    optionId: string;
}

export interface IUserQuizAnswerRepository {
    createManyForUser(data: ICreateUserQuizAnswerDTO[]): Promise<void>;
}
