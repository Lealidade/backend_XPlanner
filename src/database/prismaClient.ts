// src/database/prismaClient.ts

// IMPORTANTE: como você colocou `output = "../src/generated/prisma"`
// no generator do Prisma, o client fica aqui:
import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient();
