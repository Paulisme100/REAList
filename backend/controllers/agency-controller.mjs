import Agency from '../models/agency.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
            attributes: {exclude: ["account_password"]}
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
            cui: req.body.cui
        })
        res.status(200).json({message: "Agency account created!"})
        
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
    try {
        const agencyProfile = await Agency.findOne({
            where: {
                company_email: req.user.company_email
            },
            attributes: {exclude: ['account_password']}
        })
        
        res.status(200).json(agencyProfile)
    } catch (err) {
        console.log(err)
        res.status(200).json({message: err.message})
    }
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

        const isValid = await bcrypt.compare(req.body.account_password, agency.account_password)

        if(isValid)
        {
            const payload = {
                id: agency.id,
                company_name: agency.company_name,
                company_email: agency.company_email,
                company_phone: agency.company_phone,
                cui: agency.cui,
                accountType: 'agency'
            }

            const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'})

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 3600000
            })

            res.status(200).json(payload)
        } else {
            res.status(401).json({message: 'Invalid credentials!'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const lougout = async (req, res, next) => {
    
    try {

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: 'lax'
        })

        return res.status(200).json({message: 'Cookie cleared! Agency logged out!'})
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

export default {
    getAllAgencies,
    registerAgency,
    authenticate,
    updateAgencyAccount,
    deleteAgencyAccount,
    getAgencyProfile,
    lougout
}