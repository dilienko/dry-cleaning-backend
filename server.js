const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
require('./config/passport')
const cors = require('cors')
const passport = require('passport')

const serviceTypesRouter = require('./routes/serviceType.routes')
const clientRouter = require('./routes/client.routes')
const servicesRouter = require('./routes/service.routes')
const authRouter = require('./routes/auth.routes')

const authMiddleware = require('./middlewares/authMiddleware')

const app = express()
app.use(cors())
app.use(express.json())

connectDB()

app.use(passport.initialize())
app.use('/', authRouter)

app.use('/', authMiddleware, serviceTypesRouter)
app.use('/', authMiddleware, clientRouter)
app.use('/', authMiddleware, servicesRouter)

app.get('/', (req, res) => {
	res.send('API is running... ')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
