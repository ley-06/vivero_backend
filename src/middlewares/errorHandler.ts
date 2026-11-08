import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    console.error("================================");
    console.error("ERROR EN LA APLICACIÓN");
    console.error("Mensaje:", error.message);
    console.error("Ruta:", req.originalUrl);
    console.error("Método:", req.method);
    console.error("================================");

    // Si ya comenzó el envío de la respuesta,
    // dejamos que Express gestione el error.
    if (res.headersSent) {
        next(error);
        return;
    }

    const statusCode =
        typeof error.statusCode === "number"
            ? error.statusCode
            : 500;

    res.status(statusCode).json({
        status: "error",
        message:
            statusCode === 500
                ? "Error interno del servidor"
                : error.message
    });
};

export default errorHandler;