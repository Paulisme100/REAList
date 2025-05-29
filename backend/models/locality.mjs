import { DataTypes } from "sequelize";
import sequelize from "./database.mjs";

const Locality = sequelize.define('Locality', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    county: {
        type: DataTypes.STRING,
        allowNull: false
    },
    county_abbrev: {
        type: DataTypes.STRING,
        allowNull: false
    }   
}, {
    timestamps: false
})

export default Locality