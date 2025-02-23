const express = require('express')
const Client = require('../models/client.model')

const router = express.Router()

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Getting or creating a client
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
 *         description: Client found or created
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/api/client', async (req, res) => {
	const { firstName, surname, middleName } = req.query

	try {
		if (!firstName || !surname || !middleName) {
			return res.status(400).json({ message: 'Missing required parameters' })
		}
		const client = await Client.findOneAndUpdate(
			{ firstName, surname, middleName },
			{ $setOnInsert: { isRegular: false } },
			{ upsert: true, new: true }
		)

		res.status(200).json(client)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

/**
 * @swagger
 * /api/client:
 *   patch:
 *     summary: Updating customer status to "regular"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Client`s ID
 *     responses:
 *       200:
 *         description: Client updated
 *       400:
 *         description: Invalid request
 */
router.patch('/api/client', async (req, res) => {
	try {
		const updatedClient = await Client.findByIdAndUpdate(
			req.body.id,
			{
				$set: { isRegular: true },
			},
			{ new: true }
		)
		res.json(updatedClient)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

module.exports = router
