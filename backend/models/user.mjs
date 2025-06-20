import sequelize from "./database.mjs";
import { DataTypes } from "sequelize";



const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('regular', 'agent', 'admin'), allowNull: false, defaultValue: 'regular' },
    hire_date: { type: DataTypes.DATEONLY, allowNull: true},
    birth_date: { type: DataTypes.DATEONLY, allowNull: true },
    phone_number: { type: DataTypes.STRING, allowNull: true },
    agentStatus: { type: DataTypes.ENUM('accepted', 'pending', 'rejected'), allowNull: true},
    pushSubscription: { type: DataTypes.TEXT, allowNull: true }
  }, 
  { timestamps: true }
);
  
export default User;  