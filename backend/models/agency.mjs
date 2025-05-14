import sequelize from "./database.mjs";
import { DataTypes } from "sequelize";

const Agency = sequelize.define('Agency', {
    company_name: { type: DataTypes.STRING, allowNull: false },
    company_email: { type: DataTypes.STRING, unique: true, allowNull: false },
    account_password: {type: DataTypes.STRING, allowNull: false },
    company_phone: { type: DataTypes.STRING, allowNull: false },
    head_office_address: { type: DataTypes.STRING, allowNull: false }
  }, 
  { timestamps: true }
);
  
export default Agency;