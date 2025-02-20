const express = require('express')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router()

router.post('/login', async (req, res) => {
	const { username, password } = req.body

	try {
		const user = await User.findOne({ username })
		if (!user) {
			return res.status(400).json({ message: 'Користувача не знайдено' })
		}

		const isMatch = await user.comparePassword(password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Невірний пароль' })
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		})

		res.json({ token })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
