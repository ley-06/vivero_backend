
import { Request, Response, NextFunction } from "express";
import { UniqueConstraintError, ForeignKeyConstraintError } from "sequelize";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuario";

// =====================================================
// OBTENER TODOS LOS USUARIOS
// GET /api/usuarios
// =====================================================

export const getUsuarios = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ["contrasena"] }
        });

        res.status(200).json({
            status: "success",
            total: usuarios.length,
            usuarios
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// OBTENER UN USUARIO POR SU ID
// GET /api/usuarios/:id
// =====================================================

export const getUsuarioById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "error",
                message: "El ID proporcionado no es válido"
            });
            return;
        }

        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ["contrasena"] }
        });

        if (!usuario) {
            res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
            return;
        }

        res.status(200).json({
            status: "success",
            usuario
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// CREAR UN USUARIO
// POST /api/usuarios
// =====================================================

export const createUsuario = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            nombre,
            apellidos,
            usuario,
            contrasena,
            telefono
        } = req.body;

        // Validar campos obligatorios
        if (
            typeof nombre !== "string" ||
            typeof apellidos !== "string" ||
            typeof usuario !== "string" ||
            typeof contrasena !== "string" ||
            !nombre.trim() ||
            !apellidos.trim() ||
            !usuario.trim() ||
            !contrasena
        ) {
            res.status(400).json({
                status: "error",
                message: "Todos los campos obligatorios deben estar completos"
            });
            return;
        }

        // Validar contraseña
        if (contrasena.length < 8) {
            res.status(400).json({
                status: "error",
                message: "La contraseña debe tener al menos 8 caracteres"
            });
            return;
        }

        // Validar teléfono
        if (
            telefono !== undefined &&
            telefono !== null &&
            typeof telefono !== "string"
        ) {
            res.status(400).json({
                status: "error",
                message: "El teléfono no es válido"
            });
            return;
        }

        // Comprobar si el nombre de usuario ya existe
        const usuarioExistente = await Usuario.findOne({
            where: {
                usuario: usuario.trim()
            }
        });

        if (usuarioExistente) {
            res.status(409).json({
                status: "error",
                message: "Ese nombre de usuario ya está registrado"
            });
            return;
        }

        // Cifrar la contraseña
        const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

        // Crear usuario
        // Los registros públicos se crean con rol cliente.
        const nuevoUsuario = await Usuario.create({
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            usuario: usuario.trim(),
            contrasena: contrasenaCifrada,
            rol: "cliente",
            telefono: telefono?.trim() || null
        });

        res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente",
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                nombre: nuevoUsuario.nombre,
                apellidos: nuevoUsuario.apellidos,
                usuario: nuevoUsuario.usuario,
                rol: nuevoUsuario.rol,
                telefono: nuevoUsuario.telefono
            }
        });

    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                status: "error",
                message: "El nombre de usuario ya está registrado"
            });
            return;
        }

        next(error);
    }
};

// =====================================================
// ACTUALIZAR UN USUARIO
// PUT /api/usuarios/:id
// =====================================================

export const updateUsuario = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "error",
                message: "El ID proporcionado no es válido"
            });
            return;
        }

        const usuarioEncontrado = await Usuario.findByPk(id);

        if (!usuarioEncontrado) {
            res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
            return;
        }

        const {
            nombre,
            apellidos,
            usuario,
            contrasena,
            telefono
        } = req.body;

        // Actualizar nombre
        if (nombre !== undefined) {
            if (typeof nombre !== "string" || !nombre.trim()) {
                res.status(400).json({
                    status: "error",
                    message: "El nombre no es válido"
                });
                return;
            }

            usuarioEncontrado.nombre = nombre.trim();
        }

        // Actualizar apellidos
        if (apellidos !== undefined) {
            if (typeof apellidos !== "string" || !apellidos.trim()) {
                res.status(400).json({
                    status: "error",
                    message: "Los apellidos no son válidos"
                });
                return;
            }

            usuarioEncontrado.apellidos = apellidos.trim();
        }

        // Actualizar nombre de usuario
        if (usuario !== undefined) {
            if (typeof usuario !== "string" || !usuario.trim()) {
                res.status(400).json({
                    status: "error",
                    message: "El nombre de usuario no es válido"
                });
                return;
            }

            const usuarioExistente = await Usuario.findOne({
                where: {
                    usuario: usuario.trim()
                }
            });

            if (
                usuarioExistente &&
                usuarioExistente.id_usuario !== id
            ) {
                res.status(409).json({
                    status: "error",
                    message: "Ese nombre de usuario ya está registrado"
                });
                return;
            }

            usuarioEncontrado.usuario = usuario.trim();
        }

        // Actualizar contraseña
        if (contrasena !== undefined) {
            if (
                typeof contrasena !== "string" ||
                contrasena.length < 8
            ) {
                res.status(400).json({
                    status: "error",
                    message: "La contraseña debe tener al menos 8 caracteres"
                });
                return;
            }

            usuarioEncontrado.contrasena = await bcrypt.hash(
                contrasena,
                10
            );
        }

        // Actualizar teléfono
        if (telefono !== undefined) {
            if (
                telefono !== null &&
                typeof telefono !== "string"
            ) {
                res.status(400).json({
                    status: "error",
                    message: "El teléfono no es válido"
                });
                return;
            }

            usuarioEncontrado.telefono = telefono?.trim() || null;
        }

        // No se modifica el rol desde este endpoint público.
        await usuarioEncontrado.save();

        res.status(200).json({
            status: "success",
            message: "Usuario actualizado correctamente",
            usuario: {
                id_usuario: usuarioEncontrado.id_usuario,
                nombre: usuarioEncontrado.nombre,
                apellidos: usuarioEncontrado.apellidos,
                usuario: usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol,
                telefono: usuarioEncontrado.telefono
            }
        });

    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                status: "error",
                message: "El nombre de usuario ya está registrado"
            });
            return;
        }

        next(error);
    }
};

// =====================================================
// ELIMINAR UN USUARIO
// DELETE /api/usuarios/:id
// =====================================================

export const deleteUsuario = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "error",
                message: "El ID proporcionado no es válido"
            });
            return;
        }

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
            return;
        }

        await usuario.destroy();

        res.status(200).json({
            status: "success",
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        if (error instanceof ForeignKeyConstraintError) {
            res.status(409).json({
                status: "error",
                message: "No se puede eliminar este usuario porque tiene registros relacionados"
            });
            return;
        }

        next(error);
    }
};
