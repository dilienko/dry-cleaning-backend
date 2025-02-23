const express = require('express')
const Service = require('../models/service.model')
const Client = require('../models/client.model')

const router = express.Router()

/**
 * @swagger
 * /api/services/clientOrders:
 *   get:
 *     summary: Receiving customer orders
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         required: true
 *         description: Client`s name (Ім'я клієнта)
 *       - in: query
 *         name: surname
 *         schema:
 *           type: string
 *         required: true
 *         description: Client`s surname (Прізвище клієнта)
 *       - in: query
 *         name: middleName
 *         schema:
 *           type: string
 *         required: true
 *         description: Client`s middle name (По батькові клієнта)
 *     responses:
 *       200:
 *         description: Customer orders array
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.get('/api/services/clientOrders', async (req, res) => {
	const { firstName, surname, middleName } = req.query
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

/**
 * @swagger
 * /api/services/:
 *   get:
 *     summary: Receive all orders or orders of a specific branch
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         required: false
 *         description: Dry cleaner branch name (optional)
 *     responses:
 *       200:
 *         description: Order list
 *       500:
 *         description: Server error
 */
router.get('/api/services/', async (req, res) => {
	try {
		const branch = req.query.branch
		const services = await Service.find(
			branch !== '' ? { branch } : {}
		).populate(['serviceType', 'client'])
		res.status(200).json(services)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

/**
 * @swagger
 * /api/services/new:
 *   put:
 *     summary: Creating a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: Client's ID
 *               serviceTypesId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Service types ID
 *               branch:
 *                 type: string
 *                 description: Dry cleaning brach
 *               status:
 *                 type: string
 *                 description: Order status
 *               totalPrice:
 *                 type: number
 *                 description: Total price
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Creation error
 */
router.put('/api/services/new', async (req, res) => {
	try {
		const { clientId, serviceTypesId, branch, status, totalPrice } = req.body

		if (!clientId || !serviceTypesId || !branch || !status || !totalPrice) {
			return res.status(400).json({ message: 'Missing required fields' })
		}

		let service = await Service.create({
			serviceType: serviceTypesId,
			client: clientId,
			branch: branch,
			status: status,
			totalPrice: totalPrice,
		})
		service = await service.populate(['serviceType', 'client'])

		res.status(201).json(service)
	} catch (error) {
		console.error('Error creating service:', error)
		res.status(400).json({ message: error.message })
	}
})

/**
 * @swagger
 * /api/services/status:
 *   patch:
 *     summary: Order status update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Order ID
 *               status:
 *                 type: string
 *                 description: New order status
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Required parameters are missing or update error occurred.
 */
router.patch('/api/services/status', async (req, res) => {
	const { status, id } = req.body
	if (!status || !id)
		return res.status(400).json({ message: 'Missing required fields' })
	try {
		const updatedStatus = await Service.findByIdAndUpdate(
			id,
			{
				$set: { status: status },
			},
			{ new: true }
		).populate(['serviceType', 'client'])

		if (status === 'Returned') {
			updatedStatus.returnDate = Date.now()
			await updatedStatus.save()
		}
		res.json(updatedStatus)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

module.exports = router
