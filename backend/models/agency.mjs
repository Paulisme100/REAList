import sequelize from "./database.mjs";
import { DataTypes } from "sequelize";

const Agency = sequelize.define('Agency', {
    company_name: { type: DataTypes.STRING, allowNull: false },
    company_email: { type: DataTypes.STRING, unique: true, allowNull: false },
    account_password: {type: DataTypes.STRING, allowNull: false },
    company_phone: { type: DataTypes.STRING, allowNull: false },
    head_office_address: { type: DataTypes.STRING},
    cui: { type: DataTypes.STRING, allowNull: false },
    commission_at_sale: {type: DataTypes.STRING},
    commission_at_rent: {type: DataTypes.STRING},
    logo_url: { type: DataTypes.STRING},
    pushSubscription: {type: DataTypes.TEXT}
  }, 
  { timestamps: true }
);
  
export default Agency;