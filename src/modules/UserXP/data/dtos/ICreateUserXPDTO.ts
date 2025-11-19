// src/modules/userXP/domain/dtos/ICreateUserXPDTO.ts
export interface ICreateUserXPDTO {
    userId: string;
    username?: string | null;
    birthYear?: number | null;
}
