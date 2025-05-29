import { Router } from "express";
import savedPropertyController from "../controllers/saved-property-controller.mjs";
import middlewares from "../middlewares/index.mjs";

const savedPropertyRouter = Router()

savedPropertyRouter.get('/', savedPropertyController.showSavedProperties)
savedPropertyRouter.post('/', middlewares.verifyToken, savedPropertyController.markAsSaved)
savedPropertyRouter.delete('/', middlewares.verifyToken, savedPropertyController.unSave)

export default savedPropertyRouter