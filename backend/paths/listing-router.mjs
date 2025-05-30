import { Router } from "express";
import listingController from "../controllers/listing-controller.mjs";
import middlewares from "../middlewares/index.mjs";
import upload from "../middlewares/uploadImages.mjs";

const listingRouter = Router()

listingRouter.get('/', listingController.getAllListings)
listingRouter.get('/:id', listingController.getListingById)
listingRouter.post('/', middlewares.verifyToken, upload.array('images', 7), listingController.addListing)
listingRouter.put('/:id', middlewares.verifyToken, upload.array('images', 7), listingController.updateListing)
listingRouter.delete('/:id', middlewares.verifyToken, listingController.deleteById)
listingRouter.put('/status/:id', listingController.changeStatus)

export default listingRouter

