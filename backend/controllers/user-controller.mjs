import User from "../models/user.mjs";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
            attributes: ['name', 'email', 'role', 'AgencyId']
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
        const user = await User.findOne({
            where: {
                id: req.query.id
            }
        })
        if(user)
        {
            user.destroy()
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
            role: req.body.role
        }

        if(req.body.AgencyId)
        {
            fields.AgencyId = req.body.AgencyId
        }

        const user = await User.create({
            ...fields
        })
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
                role: user.role
            }

            const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'})
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 3600000
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
        const userProfile = await User.findOne({
            where: {
                email: req.user.email
            },
            attributes: {exclude: ['password']}
        })
        
        res.status(200).json(userProfile)
    } catch (err) {
        
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

        // if(req.query.updateField === 'password')
        // {
        //     user[req.query.updateField] = await bcrypt.hash(req.query.updateValue, 10)

        // } else {
        //     user[req.query.updateField] = req.query.updateValue
        // }

        await user.save()
        res.status(200).json({message: 'User data changed successfully'})
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

export default {
    getAllUsers,
    deleteById,
    registerNewUser,
    authenticate,
    getUserProfile,
    logUserOut,
    updateUser
}