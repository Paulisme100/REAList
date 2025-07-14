import { DataTypes } from "sequelize";
import sequelize from "./database.mjs";


const Listing = sequelize.define('Listing', 
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        propertyType: {
            type: DataTypes.ENUM('house', 'apartment', 'commercial space', 'industrial space', 'land'),
            allowNull: false
        },
        transactionType: {
            type: DataTypes.ENUM('sale', 'rent'),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bedrooms: {
            type: DataTypes.INTEGER
        },
        bathrooms: {
            type: DataTypes.INTEGER
        },
        squareMeters: {
            type: DataTypes.INTEGER
        },
        constructionYear: {
            type: DataTypes.INTEGER
        },
        ad_status: {
            type: DataTypes.ENUM('active', 'inactive')
        },
        coordX: {
            type: DataTypes.FLOAT,
        },
        coordY: {
            type: DataTypes.FLOAT,
        },
        geom: {
            type: DataTypes.GEOMETRY("POINT", 4326)
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0
            
        },
        phoneReveals: {
            type: DataTypes.INTEGER,
            defaultValue: 0
            
        }


    }, 
    {
        timestamps: true
    }
)


export default Listing