const express = require('express')
const Service = require('../models/service.model')
const Client = require('../models/client.model')

const router = express.Router()

//Може повертати пустий масив
router.get('/api/services/clientOrders', async (req, res) => {
	const { firstName, surname, middleName } = req.body
	try {
		const currentClient = await Client.findOne({
			firstName: firstName,
			surname: surname,
			middleName: middleName,
		})
		if (currentClient) {
			const orders = await Service.find({ client: currentClient._id }).populate(
				['serviceType', 'client']
			)

			res.status(200).json(orders)
		} else {
			res.status(404).send({})
		}
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

router.get('/api/services/:branch?', async (req, res) => {
	try {
		const branch = req.params.branch
		const services = await Service.find(branch ? { branch } : {}).populate([
			'serviceType',
			'client',
		])
		res.status(200).json(services)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

router.put('/api/services/new', async (req, res) => {
	try {
		const { clientId, serviceTypesId, branch, status } = req.body

		if (!clientId || !serviceTypesId || !branch || status === undefined) {
			return res.status(400).json({ message: 'Missing required fields' })
		}

		let service = await Service.create({
			serviceType: serviceTypesId,
			client: clientId,
			branch: branch,
			status: status,
		})
		service = await service.populate(['serviceType', 'client'])

		res.status(201).json(service)
	} catch (error) {
		console.error('Error creating service:', error)
		res.status(400).json({ message: error.message })
	}
})

router.patch('/api/services/status/:id', async (req, res) => {
	const status = req.body.status
	if (status === undefined)
		return res.status(400).json({ message: 'Missing required fields' })
	try {
		const updatedStatus = await Service.findByIdAndUpdate(
			req.params.id,
			{
				$set: { status: status },
			},
			{ new: true }
		).populate(['serviceType', 'client'])
		res.json(updatedStatus)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

router.patch('/api/services/returnOrder/:orderId', async (req, res) => {
	try {
		const updatedDate = await Service.findByIdAndUpdate(
			req.params.orderId,
			{
				$set: { returnDate: Date.now() },
			},
			{ new: true }
		).populate(['serviceType', 'client'])
		res.json(updatedDate)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

module.exports = router
