import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/basedatos";

interface ProductoAtributos {
    id_producto: number;
    tipo: string;
    nombre: string;
    descripcion: string | null;
    precio: number;
    imagen: string | null;
    activo: boolean;
}

interface ProductoCreationAttributes
    extends Optional<ProductoAtributos, "id_producto" | "activo"> {}

class Producto extends Model<
    ProductoAtributos,
    ProductoCreationAttributes
> implements ProductoAtributos {

    public id_producto!: number;
    public tipo!: string;
    public nombre!: string;
    public descripcion!: string | null;
    public precio!: number;
    public imagen!: string | null;
    public activo!: boolean;
}

Producto.init(
    {
        id_producto: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        tipo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },

        imagen: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        tableName: "producto",
        timestamps: false
    }
);

export default Producto;