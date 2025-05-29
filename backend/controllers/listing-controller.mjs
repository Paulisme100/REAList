import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Op, Sequelize } from "sequelize";
import User from "../models/user.mjs";
import Listing from "../models/listing.mjs";
import Locality from "../models/locality.mjs";
import Image from "../models/image.mjs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STOP_WORDS = new Set([
    'the', 'in', 'on', 'at', 'by', 'for', 'with', 'a', 'an',
    'and', 'or', 'of', 'to', 'from', 'into', 'onto', 'over', 'under', 
    'camere', 'zona', 'cartier', 'cu', 'spre', 'langa', 'din', 'aproape', 'de',
    'pentru', 'despre', 'inspre'
  ]);

const getAllListings = async (req, res, next) => {
    try {
        
        let filterQuery = {
            where: {
                ad_status: 'active'
            }
        }

        //implementation for token based retrieval, to filter the ads of a specific user
        if (req.user?.id) {
            filterQuery.where.UserId = req.user.id;
        } else {
            filterQuery.where.UserId = { [Op.ne]: null };
        }

        if(req.query.title) {

            const rawKeywords = req.query.title.trim().split(/\s+/)

            const keywords = rawKeywords.filter(word => !STOP_WORDS.has(word));

            if (keywords.length) {
                filterQuery.where.title = {                  
                    [Op.or]: keywords.map(word => ({
                        [Op.iLike]: `%${word}%`
                    }))
                }
            } else {
                filterQuery.where.title = ""
            }
        }

        if(req.query.lid) {
            filterQuery.where.id = req.query.lid
        }

        if(req.query.ad_status) {
            filterQuery.where.ad_status = req.query.ad_status
        }

        const localityRelObj = {
            model: Locality,
            attributes: ['name', 'county', 'county_abbrev'],
            where: {},
            required: true
        }

        if(req.query.county){
            localityRelObj.where.county = req.query.county
        }

        if(req.query.locality){
            localityRelObj.where.name = req.query.locality
        }

        filterQuery.include = [
            {
                model: User,
                attributes: ['id', 'name'],
                required: false
            }, 
            {
              model: Image,
              attributes: ['url'],
              required: false
            },
            localityRelObj
        ]
    

        const listings = await Listing.findAll({
            ...filterQuery,
        })

        if(listings.length > 0)
        {
            res.status(200).json(listings)
        } else {
            res.status(200).json({message: 'No listings added!'})
        }
        
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
}

const getListingById = async (req, res, next) => {

    try {

        const listing = await Listing.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                    required: true
                }, 
                {
                  model: Image,
                  attributes: ['url'],
                  required: false
                },
                {
                    model: Locality,
                    attributes: ['name', 'county', 'county_abbrev'],
                    required: false
                }
            ],
        })

        res.status(200).json(listing)
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

const getListingsWithinShape = async (req, res) => {
  try {
    const { polygon } = req.body;

    if (!polygon || !polygon.coordinates) {
      return res.status(400).json({ message: "Invalid polygon data" });
    }

    const geoJson = JSON.stringify(polygon);

    const listings = await Listing.findAll({
      where: Sequelize.literal(`
        ST_Contains(
          ST_SetSRID(ST_GeomFromGeoJSON('${geoJson}'), 4326),
          ST_SetSRID(ST_MakePoint("coordY", "coordX"), 4326)
        )
      `),
      include: [
        {
          model: Locality,
          attributes: ['name', 'county', 'county_abbrev']
        },
        {
          model: Image,
          attributes: ['url'],
        },
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.status(200).json(listings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error querying listings" });
  }
};

const addListing = async (req, res, next) => {
    try {
        if(!req.body)
            {
                return res.status(400).json({message: 'Empty request body'})
            }

        let fields = req.body
            
        const locality = await Locality.findOne({
            where: {
                name: req.body.locality
            },
            attributes: ['id']
        });

        let full_address = ''
        if(req.body.county == 'Bucuresti')
        {
            full_address = `${req.body.address}, Bucuresti, Romania`
        } else {
            full_address = `${req.body.address}, ${req.body.locality}, Romania`
        }
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(full_address)}`;

        const response = await fetch(url, {
            headers: {
            'User-Agent': 'REAList v2.0 (pavelv2913@gmail.com)'
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim error: ${response.statusText}`);
        }

        const geoData = await response.json()

        if(!geoData.length){
           
            return res.status(400).json({message: "Geocoding failed. Address not found"})
        }

        fields.coordX = geoData[0].lat
        fields.coordY = geoData[0].lon

        fields.geom = {
            type: "Point",
            coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
        }

        if(!locality){
            return res.status(400).json({message: "Locality not found!"})
        } else {
            fields.LocalityId = locality.id
        }

        const listing = await Listing.create(fields)

        const images = req.files.map(file => {
            Image.create({
                url: `/uploads/${file.filename}`,
                ListingId: listing.id
            })
        })

        await Promise.all(images)

        return res.status(200).json({message: "Listing created succesfully!"})
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

const updateListing = async (req, res, next) => {

    try {

        const listing = await Listing.findByPk(req.params.id)

        if(!listing)
        {
            return res.status(404).json({message: "Listing not found!"})
        } else {
            if(!req.body)
            {
                return res.status(400).json({message: "No values provided for updating!"})
            }

            let localityId;
            if(req.body.locality){
                const locality = await Locality.findOne({
                    where: {
                        name: req.body.locality 
                    },
                    attributes: ['id']
                });
                if(locality)
                {
                    localityId = locality.id
                }
            }

            let fields = req.body
            if(localityId){
                fields.LocalityId = localityId
            }

            listing.update(fields)

            if (req.files && req.files.length > 0) {
                const images = req.files.map(file =>
                    Image.create({
                        url: `/uploads/${file.filename}`,
                        ListingId: listing.id
                    })
                )
                await Promise.all(images)
            }
            
            return res.status(200).json({ message: "Listing updated successfully!" })
        }
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

const changeStatus = async (req, res, next) => {

    try {

        const listing = await Listing.findByPk(req.params.id)

        if(!listing)
        {
            return res.status(404).json({message: "Listing not found!"})
        } else {
            if(listing.ad_status == 'active')
            {
                listing.ad_status = "inactive"
            } else {
                listing.ad_status = "active"
            }
            listing.save()
            return res.status(200).json({message: "Listing status changed successfully!"})
        }   

        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

const deleteById = async (req, res, next) => {

    try {
        const listing = await Listing.findByPk(req.params.id,{
            include: [Image]
        })
        if(!listing)
        {
            return res.status(404).json({message: "Listing not found!"})
        }

        for (const image of listing.Images) {
            const filePath = path.join(__dirname, '..', 'uploads', path.basename(image.url));
            fs.unlink(filePath, err => {
                if (err) console.warn(`Failed to delete image file: ${filePath}`, err);
            });
        }

        await Image.destroy({ where: { ListingId: listing.id } });
        
        await listing.destroy()
        return res.status(200).json({message: "Listing and images were deleted!"})
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

export default {
    getAllListings,
    getListingById,
    getListingsWithinShape,
    addListing,
    updateListing,
    deleteById,
    changeStatus
}