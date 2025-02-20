const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = () => {
	return mongoose
		.connect(process.env.DB_URI)
		.then(() => console.log('MongoDB Connected...'))
		.catch(error => {
			console.error(' MongoDB Connection Error:', error)
		})
}

module.exports = connectDB
