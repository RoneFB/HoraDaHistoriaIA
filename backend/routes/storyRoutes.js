const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/generate-story', async (req, res) => {
    try {
        const { prompt, service, age, theme, category, language } = req.body;

        if (!service) {
            return res.status(400).json({ error: 'Service type is required' });
        }

        const story = await aiService.generateStory(prompt, service, { age, theme, category, language });
        res.json({ story });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
