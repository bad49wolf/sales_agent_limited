const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const get_voice_mode_token = async (req, res) => {
    try {
        // Read instructions from file
        const instructionsPath = path.join(__dirname, 'instructions.txt');
        const instructions = await fs.readFile(instructionsPath, 'utf8');

        const response = await axios.post("https://api.openai.com/v1/realtime/sessions", {
            model: "gpt-4o-realtime-preview-2024-12-17",
            voice: "verse",
            "modalities": ["audio", "text"],
            "instructions": instructions.trim()
        }, {
            headers: {
                "Authorization": `Bearer ${add_your_token_here}`,
                "Content-Type": "application/json",
            }
        });
        console.log(response.data)

        res.json(response.data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Instructions file not found');
            res.status(404).json({
                error: 'Instructions file not found'
            });
            return;
        }

        console.error('Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error || 'Failed to fetch token'
        });
    }
};

module.exports = get_voice_mode_token;