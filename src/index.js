import express from 'express';
import cors from 'cors';
import axios from 'axios';
import validateName from './validate.js';

const app = express();
app.use(cors());

app.use(express.json());

app.get('/api/classify', async (req, res) => {
    try {
        const name = req.query.name
        console.log(typeof (name))

        const validation = validateName(name);

        if (!validation.isValid) {
            return res.status(400).json({
                status: "error",
                message: validation.message
            });
        }

        // Call Genderize API
        const response = await axios.get(`https://api.genderize.io`, {
            params: { name }
        });

        const { gender, probability, count } = response.data;

        // 3. Edge Case Handling
        if (!gender || count === 0) {
            return res.status(200).json({
                status: "error",
                message: `No prediction available for the provided name ${name}`
            });
        }

        // 4. Process Data
        const sample_size = count;
        const is_confident = probability >= 0.7 && sample_size >= 100;

        // 5. Generate timestamp (UTC ISO 8601)
        const processed_at = new Date().toISOString();

        // 6. Response
        return res.status(200).json({
            status: "success",
            data: {
                name: name.toLowerCase(),
                gender,
                probability,
                sample_size,
                is_confident,
                processed_at
            }
        });
    } catch (error) {
        console.error(error.message);

        // Upstream/API failure
        if (error.response) {
            return res.status(502).json({
                status: "error",
                message: "Upstream service failure"
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }

})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});