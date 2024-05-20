require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

// Set up Google Cloud Vision client
const client = new ImageAnnotatorClient();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/analyze', upload.single('frame'), async (req, res) => {
    try {
        const [result] = await client.labelDetection(req.file.buffer);
        const labels = result.labelAnnotations;
        res.json(labels);
    } catch (error) {
        console.error('Error analyzing the frame: ', error);
        res.status(500).send('Error analyzing the frame');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
