import sequelize from "../models/database.mjs";
import Locality from "../models/locality.mjs";

const getAllLocalities = async (req, res, next) => {

    try {

        let filterQuery = {}

        if(req.body && req.body.filterField && req.body.filterValue) {
            filterQuery.where = {
                [req.body.filterField]: req.body.filterValue
            }
        }

        const localities = await Locality.findAll({
            ...filterQuery
        })

        if(localities)
        {
            res.status(200).json(localities)
        } else {
            res.status(400).json({message: 'No localities present!'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const getAllCounties = async (req, res) => {

    try {
        
        const counties = await Locality.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('county')), 'county']],
            order: [['county', 'ASC']]
        })

        res.json(counties.map(c => c.county))

    } catch (err) {
        res.status(400).json({ message: 'Failed to fetch counties' })
    }
}

const getLocalitiesFromCounty = async (req, res) => {
    try {
      const localities = await Locality.findAll({
        where: { 
            county: req.params.county 
        },
        attributes: ['name'],
        order: [['name', 'ASC']]
      })
      res.json(localities.map(l => l.name))
    } catch (err) {
        res.status(400).json({ message: 'Failed to fetch localities' })
    }
}

export default {
    getAllLocalities,
    getAllCounties,
    getLocalitiesFromCounty
}