import { Router } from "express";

import {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
} from "../controllers/usuarioController";

const router = Router();

// Obtener todos los usuarios
router.get("/", getUsuarios);

// Obtener un usuario por ID
router.get("/:id", getUsuarioById);

// Registrar un usuario
router.post("/", createUsuario);

// Actualizar un usuario
router.put("/:id", updateUsuario);

// Eliminar un usuario
router.delete("/:id", deleteUsuario);

export default router;