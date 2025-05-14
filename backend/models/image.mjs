import sequelize from "./database.mjs";
import { DataTypes } from "sequelize";

const Image = sequelize.define('Image', {
    
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

export default Image;