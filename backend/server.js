const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js')
require('dotenv').config();

const app = express()

// Middleware
app.use(cors());
app.use(express.json()); // อ่าน json ที่ส่งมาได้

app.use('/auth', authRoutes);

//connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err))

// test route
app.get('/', (req, res) => {
    res.send('Gmae Fineder API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is barking on port ${PORT}`)
})