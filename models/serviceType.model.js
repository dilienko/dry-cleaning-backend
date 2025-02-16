const mongoose = require('mongoose')

const serviceTypeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	price: { type: Number, required: true },
})

module.exports = mongoose.model('ServiceType', serviceTypeSchema)
