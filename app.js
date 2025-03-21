const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

const app = express();
const PORT = 3000;

// Enable CORS 
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

// DB Connection
connectDB();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Application will run on 3000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});