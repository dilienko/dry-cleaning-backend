const express = require('express')
const Client = require('../models/client.model')

const router = express.Router()

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
