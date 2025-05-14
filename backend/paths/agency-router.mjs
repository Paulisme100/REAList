import { Router } from "express";
import agencyController from "../controllers/agency-controller.mjs";

const agencyRouter = Router()

agencyRouter.get('/', agencyController.getAllAgencies)
agencyRouter.post('/', agencyController.registerAgency)
agencyRouter.put('/:id', agencyController.updateAgencyAccount)
agencyRouter.delete('/:id', agencyController.deleteAgencyAccount)

export default agencyRouter