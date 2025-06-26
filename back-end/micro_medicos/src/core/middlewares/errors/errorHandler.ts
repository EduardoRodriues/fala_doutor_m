import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("⛔ Erro capturado:", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const fields = (err.meta?.target as string[])?.join(", ");
      res.status(409).json({
        error: `Campo(s) único(s) duplicado(s): ${fields}`,
      });
      return;
    }
  }

  if (err instanceof Error) {
    res.status(500).json({
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    error: "Erro interno no servidor.",
  });
}
