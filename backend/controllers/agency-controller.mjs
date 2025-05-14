import Agency from '../models/agency.mjs'
import bcrypt from 'bcrypt'

const getAllAgencies = async (req, res, next) => {

    try {

        let filterQuery = {}
        if(req.query.filterField && req.query.filterValue)
        {
            filterQuery.where = {
                [req.query.filterField]: req.query.filterValue
            }
        }
        const agencies = await Agency.findAll({...filterQuery,
            attributes: ['id', 'company_name', 'company_email', 'company_phone', 'head_office_address']
        })
        if(agencies.length > 0)
        {
            res.status(200).json(agencies)
        } else {
            res.status(200).json({message: 'No agencies present!'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const registerAgency = async (req, res, next) => {
    try {
        if(!req.body)
        {
            res.status(400).json({message: 'Empty request body'})
        }

        const agency = await Agency.create({
            company_name: req.body.company_name,
            company_email: req.body.company_email,
            account_password: await bcrypt.hash(req.body.account_password, 10),
            company_phone: req.body.company_phone,
            head_office_address: req.body.head_office_address
        })
        res.status(200).json(agency)
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const updateAgencyAccount = async (req, res, next) => {
    try {
        if(!req.body)
        {
            res.status(400).json({message: 'Empty request body'})
        }

        const agency = await Agency.findByPk(req.params.id)
        if(!agency)
        {
            res.status(404).json({message: 'Agency not found!'})
        }

        agency.company_name = req.body.company_name
        agency.company_email = req.body.company_email
        agency.account_password = await bcrypt.hash(req.body.account_password, 10)
        agency.company_phone = req.body.company_phone
        agency.head_office_address = req.body.head_office_address

        await agency.save()
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const deleteAgencyAccount = async (req, res, next) => {
    try {
        const agency = await Agency.findByPk(req.params.id)
        if(!agency)
        {
            res.status(404).json({message: 'Agency not found!'})
        }

        await agency.destroy()
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const getAgencyProfile = async (req, res, next) => {
//TO DO
}

const deleteAgent = async (req, res, next) => { 
//TO DO
}

const authenticate = async (req, res, next) => {
    try {
        if(!req.body)
            {
                res.status(400).json({message: 'Empty request body'})
            }

        const agency = await Agency.findOne({
            where: {
                company_email: req.body.company_email
            }
        })
        if(!agency)
        {
            res.status(404).json({message: 'Agency not found!'})
        }

        const isMatch = await bcrypt.compare(req.body.account_password, agency.account_password)

        if(isMatch)
        {
            res.status(200).json(agency)
            //TO DO: generate jwt token and send it bakc to client
        } else {
            res.status(401).json({message: 'Invalid credentials!'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const lougout = async (req, res, next) => {
    //TO DO: invalidate token, or better remove it from client (that means clear the cookie)
}

export default {
    getAllAgencies,
    registerAgency,
    updateAgencyAccount,
    deleteAgencyAccount
}