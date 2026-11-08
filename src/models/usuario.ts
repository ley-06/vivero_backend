import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/basedatos";

interface UsuarioAtributos {
    id_usuario: number;
    nombre: string;
    apellidos: string;
    usuario: string;
    contrasena: string;
    rol: string;
    telefono: string | null;
}

interface UsuarioCreationAttributes
    extends Optional<UsuarioAtributos, "id_usuario"> {}

class Usuario extends Model<
    UsuarioAtributos,
    UsuarioCreationAttributes
> implements UsuarioAtributos {

    public id_usuario!: number;
    public nombre!: string;
    public apellidos!: string;
    public usuario!: string;
    public contrasena!: string;
    public rol!: string;
    public telefono!: string | null;
}

Usuario.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: DataTypes.STRING(60),
            allowNull: false
        },

        apellidos: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        usuario: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        contrasena: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        rol: {
            type: DataTypes.STRING(60),
            allowNull: false
        },

        telefono: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: "usuario",
        timestamps: false
    }
);

export default Usuario;