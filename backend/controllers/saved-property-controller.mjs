import SavedProperty from "../models/saved_property.mjs";
import User from "../models/user.mjs";
import Listing from "../models/listing.mjs";

const showSavedProperties = async (req, res, next) => {

    try {
        if(!req.query.UserId) {
            return res.status(400).json({message: 'There must be a user'})
        }

        let filterQuery = {
            where: {}
        };

        if(req.query.UserId){
            filterQuery.where.UserId = req.query.UserId
        }

        if(req.query.ListingId){
            filterQuery.where.ListingId = req.query.ListingId
        }

        const savedProperties = await SavedProperty.findAll({
            ...filterQuery,
            include: {
                model: Listing,
                // attributes: ['id', 'title', 'price'],
                required: false
            }
        })

        if(savedProperties.length > 0) {
            res.status(200).json(savedProperties)
        } else {
            res.status(200).json({message: 'No saved properties found!'})
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const markAsSaved = async (req, res, next) => {
    try {
        if(!req.body || !req.body.UserId || !req.body.ListingId) {
            return res.status(400).json({message: 'Empty request body'})
        }

        const savedProperty = await SavedProperty.create(req.body)

        res.status(200).json(savedProperty)

    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const unSave = async (req, res, next) => {
    try {
        if(!req.body || !req.body.UserId || !req.body.ListingId) {
            return res.status(400).json({message: 'Empty request body'})
        }

        const savedProperty = await SavedProperty.findOne({
            where: {
                UserId: req.body.UserId,
                ListingId: req.body.ListingId
            }
        })

        if(savedProperty) {
            await savedProperty.destroy()
            res.status(200).json({message: 'Property unsaved successfully!'})
        } else {
            res.status(404).json({message: 'Saved property not found!'})
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

export default {
    markAsSaved,
    showSavedProperties,
    unSave
}