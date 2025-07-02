import Agency from '../models/agency.mjs'
import User from '../models/user.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from "fs";
import path from "path";

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

const getAllAgents = async (req, res, next) => {

    if(!req.user.id){
        return res.status(400).json({message: 'Company must be identified first!'})
    }

    let filterQuery = { 
        where: {
            AgencyId: req.user.id
        }
    }

    if(req.query.agentStatus){
        filterQuery.where.agentStatus = req.query.agentStatus
    }

    let attributesQuery = { exclude: ["password"]}; 

    const agents = await User.findAll({
        ...filterQuery,
        attributesQuery
    })

    if(!agents){
        res.status(404).json({message: "No agents found in this company!"})
    } else {
        res.status(200).json(agents)
    }

}

const getAgentIds = async (req, res, next) => { 

    if(!req.user.id){
        return res.status(400).json({message: 'Company must be identified first!'})
    }

    let filterQuery = { 
        where: {
            AgencyId: req.user.id
        }
    }

    const agents = await User.findAll({
        ...filterQuery,
        attributes: ['id']
    })

    return res.status(200).json(agents)
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

        const agency = await Agency.findByPk(req.user.id)
        if(!agency)
        {
            res.status(404).json({message: 'Agency not found!'})
        }

        const fields = req.body;
        if (req.file) {

            const oldLogoPath = agency.logo_url
            ? path.join(process.cwd(), "uploads", "agency-logos", path.basename(agency.logo_url))
            : null;

            fields.logo_url = `/uploads/agency-logos/${req.file.filename}`;

            if (oldLogoPath && fs.existsSync(oldLogoPath)) {
                fs.unlink(oldLogoPath, (err) => {
                    if (err) console.error("Failed to delete old logo:", err);
                });
            }
        }

        await agency.update(fields)
        
        res.status(200).json(agency);
        
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

const authenticate = async (req, res, next) => {
    try {
        if(!req.body || !req.body.company_email ||  !req.body.account_password)
            {
                return res.status(400).json({message: 'Provide email and password!'})
            }

        const agency = await Agency.findOne({
            where: {
                company_email: req.body.company_email
            }
        })
        if(!agency)
        {
            return res.status(404).json({message: 'Agency not found!'})
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

            const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '12h'})

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 3600000*12
            })

            payload.head_office_address = agency.head_office_address
            payload.commission_at_sale = agency.commission_at_sale
            payload.commission_at_rent = agency.commission_at_rent
            payload.logo_url = agency.logo_url
            res.status(200).json(payload)
        } else {
            return res.status(401).json({message: 'Invalid credentials!'})
        }
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
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

const saveSubcription = async (req, res, next) => {

    try {
         const { agencyId, subscription } = req.body;

        if (!agencyId || !subscription)
        {
            return res.status(400).send("Missing data");
        }

        const agency = await Agency.findByPk(agencyId);
        if (!agency) {
            return res.status(404).send("Agency not found");
        }

        agency.pushSubscription = JSON.stringify(subscription);
        await agency.save()

        res.status(200).send("Subscription saved");
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
       
}

export default {
    getAllAgencies,
    getAllAgents,
    registerAgency,
    authenticate,
    updateAgencyAccount,
    deleteAgencyAccount,
    getAgencyProfile,
    lougout,
    saveSubcription,
    getAgentIds
    
}