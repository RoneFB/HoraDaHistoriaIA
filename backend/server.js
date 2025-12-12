const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const storyRoutes = require('./routes/storyRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', storyRoutes);

app.get('/', (req, res) => {
    res.send('Story Generator API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
