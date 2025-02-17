const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
const cors = require('cors')

const serviceTypesRouter = require('./routes/serviceType.routes')
const clientRouter = require('./routes/client.routes')
const servicesRouter = require('./routes/service.routes')

const app = express()
app.use(cors())
app.use(express.json())

connectDB()

app.use('/', serviceTypesRouter)
app.use('/', clientRouter)
app.use('/', servicesRouter)

app.get('/', (req, res) => {
	res.send('API is running... ')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
