require('dotenv').config()
require('./services/expiryCron')
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser=require('cookie-parser')

const inventoryRoutes=require('./routes/inventoryRoutes')
const authRoutes=require('./routes/authRoutes')
const aiRoutes=require('./routes/aiRoutes')
const app = express()
const port = process.env.port||3000

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb',extended:true}))
app.use(cookieParser())


mongoose.connect('mongodb://localhost:27017/Inventory')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/inventory',inventoryRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/ai',aiRoutes)
*

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})