import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sequelize from './models/database.mjs'
import models from './models/index.mjs'
import importCSV from './importLocalities.mjs'
import userRouter from './paths/user-router.mjs'
import listingRouter from './paths/listing-router.mjs'
import localityRouter from './paths/locality-router.mjs'
import agencyRouter from './paths/agency-router.mjs'
import savedPropertyRouter from './paths/saved-property-router.mjs'

const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use('/users', userRouter)
app.use('/listings', listingRouter)
app.use('/localities', localityRouter)
app.use('/agencies', agencyRouter)
app.use('/saved-properties', savedPropertyRouter)

try {
    await sequelize.authenticate()
    await sequelize.sync()

} catch (err) {
    console.warn(err)
}
//importCSV('./sources/localities.csv').catch(console.error);

app.listen(8080, ()  => {
    console.log('Server started on port 8080')
})