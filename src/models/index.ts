import sequelize from "../config/basedatos";

import Usuario from "./usuario";
import Producto from "./producto";

const modelos = {
    Usuario,
    Producto,
    sequelize
};

export {
    Usuario,
    Producto,
    sequelize
};

export default modelos