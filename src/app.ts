import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import sequelize from "./config/basedatos";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// =====================================================
// MIDDLEWARES GENERALES
// =====================================================

app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// CONEXIÓN CON LA BASE DE DATOS
// =====================================================

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();

        console.log(
            "Conexión con la base de datos vivero establecida correctamente."
        );

    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        throw error;
    }
};

// =====================================================
// RUTA DE PRUEBA
// =====================================================

app.get("/nueva", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is working correctly"
    });
});

// =====================================================
// RUTAS DE LA API
// =====================================================

app.use("/api", routes);

// =====================================================
// RUTA NO ENCONTRADA
// =====================================================

app.use((req, res, next) => {
    const error: any = new Error(
        `No existe la ruta: ${req.originalUrl}`
    );

    error.statusCode = 404;

    next(error);
});

// =====================================================
// MANEJADOR CENTRALIZADO DE ERRORES
// =====================================================

app.use(errorHandler);

export default app;