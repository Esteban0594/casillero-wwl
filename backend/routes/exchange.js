const express = require('express');
const router = express.Router();
const { getExchangeRate } = require('../services/exchangeRateService');
const { protect } = require('../middleware/auth');

router.get('/rate', protect, async (req, res) => {
  try {
    const rateInfo = await getExchangeRate();
    res.json(rateInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tipo de cambio' });
  }
});

module.exports = router;
