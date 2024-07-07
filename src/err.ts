export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, code: number, isOperational = true) {
    super(message);
    this.statusCode = code;
    this.isOperational = isOperational;
  }
}
