const express = require('express')
const ServiceType = require('../models/serviceType.model')

const router = express.Router()

router.get('/service-types', async (req, res) => {
	try {
		const serviceTypes = await ServiceType.find({})
		res.status(200).json(serviceTypes)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
