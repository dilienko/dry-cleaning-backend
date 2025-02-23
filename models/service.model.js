const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
	{
		serviceType: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'ServiceType',
				required: true,
			},
		],
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
			required: true,
		},
		receivedDate: { type: Date, default: Date.now, require: true },
		returnDate: { type: Date },
		branch: { type: String, required: true },
		status: { type: String, required: true },
		totalPrice: { type: Number, required: true },
	},
	{ versionKey: false }
)

module.exports = mongoose.model('Service', serviceSchema)
