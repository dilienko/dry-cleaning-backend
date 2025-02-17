const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		surname: { type: String, required: true },
		middleName: { type: String },
		isRegular: { type: Boolean, default: false },
	},
	{ versionKey: false }
)

module.exports = mongoose.model('Client', clientSchema)
