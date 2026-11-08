import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes";

const router = Router();

// Rutas de usuarios
router.use("/usuarios", usuarioRoutes);

// Ruta para comprobar el estado de la API
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

export default router;