import webpush from 'web-push'
import User from "../models/user.mjs";
import Agency from "../models/agency.mjs";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { DATEONLY } from 'sequelize';

webpush.setVapidDetails(
  'mailto:pavelv2913@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const getAllUsers = async (req, res, next) => {
    try {
        let filterQuery = {}
        if(req.query.filterField && req.query.filterValue)
        {
            filterQuery.where = {
                [req.query.filterField]: req.query.filterValue
            }
        }       
        
        const users = await User.findAll({...filterQuery,
            attributes: {exclude: ['password']}
        })
        if(users.length > 0)
        {
            res.status(200).json(users)
        } else {
            res.status(200).json({message: 'No users present!'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const deleteById = async (req, res, next) => {
    try {       

        const user = await User.findByPk(req.params.id)

        if (!req.user || req.user.id != req.params.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if(user)
        {

            res.clearCookie("token", {
                httpOnly: true,
                sameSite: 'lax'
            })

            await user.destroy()
            res.status(200).json('User removed')
        } else {
            res.status(404).json({message: 'User not found'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}
const registerNewUser = async (req, res, next) => {
    try {
        if(!req.body || !req.body.name || !req.body.email || !req.body.password || !req.body.role)
            {
                res.status(400).json({message: 'Empty or incomplete request body'})
            }

        let fields = {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            role: req.body.role,
            phone_number: req.body.phone_number
        }

        if(req.body.AgencyId)
        {
            fields.AgencyId = req.body.AgencyId
            fields.agentStatus = 'pending';
        }

        if(req.body.birth_date) {
            fields.birth_date = req.body.birth_date
        }

        const user = await User.create({
            ...fields
        })


        if (user.role === 'agent' && user.AgencyId) {

            const agency = await Agency.findByPk(user.AgencyId)

            if (agency?.pushSubscription) {
                const payload = JSON.stringify({
                    title: 'Agent Request',
    
                    body: `${user.name} requested to join your agency.`,
                    url: 'http://localhost:4173/#/agency-main'
                });
            


                try {
                    console.log('Sending push to:', agency.company_email)
                    await webpush.sendNotification(
                        JSON.parse(agency.pushSubscription),
                        payload
                    );
                    
                } catch (err) {
                console.error("Push error:", err);
                }
            }
        }

        res.status(200).json({message: "User added!"})
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const authenticate = async (req, res, next) => {
    try {
        if(!req.body)
            {
                res.status(400).json({message: 'Empty request body'})
            }

        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        let isLegit = await bcrypt.compare(req.body.password, user.password)

        if(isLegit)
        {
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
                agentStatus: user.agentStatus,
                accountType: 'user'
            }

            if(user.role == 'agent'){
                payload.AgencyId = user.AgencyId
            }

            const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '12h'})
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 3600000*12
            })
            res.status(200).json(payload)
        } else {
            res.status(400).json({message: 'Invalid credentials!'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const getUserProfile = async (req, res, next) => {

    try {
        if (req.user.accountType === 'user') {

            let optionQuery = {}
        
            if(req.user.role == 'agent')
            {
                optionQuery.include = {
                    model: Agency,
                    attributes: ['company_name', 'logo_url'],
                    required: false
                }
            }

            const userProfile = await User.findOne({
                where: { email: req.user.email },
                attributes: { exclude: ['password'] },
                optionQuery
            });

            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                ...userProfile.toJSON(),
                accountType: 'user'
            });
        }

    if (req.user.accountType === 'agency') {
        const agencyProfile = await Agency.findOne({
            where: { company_email: req.user.company_email },
            attributes: { exclude: ['account_password'] }
        });

        if (!agencyProfile) {
            return res.status(404).json({ message: 'Agency not found' });
        }

        return res.status(200).json({
            ...agencyProfile.toJSON(),
            accountType: 'agency'
        });
    }

    return res.status(400).json({ message: 'Invalid account type' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

const logUserOut = async (req, res, next) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: 'lax'
        })

        return res.status(200).json({message: 'Cookie cleared! User logged out!'})
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

const updateUser = async (req, res, next) => {
    try {

        const user = await User.findByPk(req.params.id)
        if(!user)
        {
            res.status(400).json({message: 'User not found!'})
        }

        if(req.body.email){
            user.email = req.body.email
        }

        if(req.body.name){
            user.name = req.body.name
        }

        if(req.body.phone_number){
            user.phone_number = req.body.phone_number
        }

        if(req.body.role){
            user.role = req.body.role
        }

        if(req.body.password && req.body.new_password){
            let isLegit = await bcrypt.compare(req.body.password, user.password)

            if(isLegit){
                user.password = await bcrypt.hash(req.body.new_password, 10)
            } else {
                return res.status(400).json({message: "Wrong password!"})
            }
        }

        if(req.body.AgencyId){
            user.AgencyId = req.body.AgencyId
        }

        if(req.body.agentStatus)
        {
            user.agentStatus= req.body.agentStatus
            if(req.body.agentStatus == 'accepted') {
                user.hire_date = new Date().toISOString().split('T')[0]
            }
        }
        
        await user.save()
        res.status(200).json({message: 'User data changed successfully'})
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const saveSubcription = async (req, res, next) => {

    try {
         const { userId, subscription } = req.body;

        if (!userId || !subscription)
        {
            return res.status(400).send("Missing data");
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        user.pushSubscription = JSON.stringify(subscription);
        await user.save()

        res.status(200).send("Subscription saved");
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
       
}

export default {
    getAllUsers,
    deleteById,
    registerNewUser,
    authenticate,
    getUserProfile,
    logUserOut,
    updateUser,
    saveSubcription
}