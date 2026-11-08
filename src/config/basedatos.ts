import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_NAME);
const sequelize = new Sequelize(
    process.env.DB_NAME || 'vivero',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || '5432'),
        dialect: 'postgres',

        logging: process.env.NODE_ENV === 'development'
            ? console.log
            : false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        // Respetar las tablas existentes de PHP
        define: {
            timestamps: false
        }
    }
);

export default sequelize;