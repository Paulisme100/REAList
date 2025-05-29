import sequelize from "./database.mjs";
import { DataTypes } from "sequelize";



const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('regular', 'agent', 'admin'), allowNull: false, defaultValue: 'regular' }
  }, 
  { timestamps: true }
);
  
export default User;