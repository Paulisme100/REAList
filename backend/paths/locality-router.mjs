import { Router } from "express";
import localityController from "../controllers/locality-controller.mjs";

const localityRouter = Router()

localityRouter.get('/', localityController.getAllLocalities)
localityRouter.get('/counties', localityController.getAllCounties)
localityRouter.get('/:county', localityController.getLocalitiesFromCounty)

export default localityRouter
