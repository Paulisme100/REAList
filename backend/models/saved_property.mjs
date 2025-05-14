import sequelize from "./database.mjs";
import { DataTypes } from "sequelize";


const SavedProperty = sequelize.define('SavedProperty', 
    {
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        ListingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        markedOn: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },{
        timestamps: false
    })

export default SavedProperty;