require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./dataBase/db');
const authRoutes = require('./Routes/auth-routes');
const homeRoutes = require('./Routes/home-routes');
const adminRoutes = require('./Routes/admin');
const uploadImageRoutes = require('./Routes/image-routes');
connectDB();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);                                                   
});                                                                                                                        
