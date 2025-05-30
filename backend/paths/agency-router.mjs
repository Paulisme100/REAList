import { Router } from "express";
import agencyController from "../controllers/agency-controller.mjs";
import middlewares from "../middlewares/index.mjs";

const agencyRouter = Router()

agencyRouter.get('/', agencyController.getAllAgencies)
agencyRouter.get('/agents', middlewares.verifyToken, agencyController.getAllAgents)
agencyRouter.post('/', agencyController.registerAgency)
agencyRouter.post('/login', agencyController.authenticate)
agencyRouter.post('/logout', agencyController.lougout)
agencyRouter.get('/profile', middlewares.verifyToken, agencyController.getAgencyProfile)

agencyRouter.put('/', middlewares.verifyToken, middlewares.uploadOne.single('logo'), agencyController.updateAgencyAccount)
agencyRouter.delete('/:id', agencyController.deleteAgencyAccount)

export default agencyRouter