const express = require('express')
const ServiceType = require('../models/serviceType.model')

const router = express.Router()

/**
 * @swagger
 * /api/service-types:
 *   get:
 *     summary: Get all types of services
 *     description: Returns a list of all available types of dry cleaning services.
 *     responses:
 *       200:
 *         description: Successfully received a list of service types.
 *       500:
 *         description: Server error.
 */
router.get('/api/service-types', async (req, res) => {
	try {
		const serviceTypes = await ServiceType.find({})
		res.status(200).json(serviceTypes)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
