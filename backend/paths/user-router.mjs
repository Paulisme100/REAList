import { Router } from "express";
import controllers from "../controllers/index.mjs";
import middlewares from "../middlewares/index.mjs";

const userRouter = Router()

userRouter.get('/', controllers.userController.getAllUsers);
userRouter.post('/', controllers.userController.registerNewUser)
userRouter.post('/login', controllers.userController.authenticate)
userRouter.post('/register', controllers.userController.registerNewUser)
userRouter.post('/save-subscription', controllers.userController.saveSubcription)
userRouter.put('/:id', middlewares.verifyToken, controllers.userController.updateUser)
userRouter.delete('/:id', middlewares.verifyToken, controllers.userController.deleteById)
userRouter.get('/profile', middlewares.verifyToken, controllers.userController.getUserProfile)
userRouter.post('/logout', controllers.userController.logUserOut)
userRouter.get('/user-listings', middlewares.verifyToken, controllers.listingController.getAllListings)

export default userRouter