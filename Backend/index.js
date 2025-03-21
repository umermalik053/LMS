import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import dbconnect from './Database/dbconfig.js';
import router from './Routes/userRoute.js';
import cookieParser from 'cookie-parser';
import courseRoutes from "./Routes/courseRoutes.js"
import lectureRoutes from "./Routes/lectureRoutes.js"
import mediaRoute from "./Routes/mediaRoutes.js"
import purchaseRoutes from "./Routes/purchaseRoutes.js"
import progressRoutes from "./Routes/courseProgressRoutes.js"

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
   
 }));

app.use(cookieParser())

// Load environment variables
dotenv.config({});

//Mongodb
dbconnect()




app.use("/api/v1/user", router )
app.use("/api/v1/course", courseRoutes )
app.use("/api/v1/lecture", lectureRoutes)
app.use("/api/v1/media" , mediaRoute)
app.use("/api/v1/purchase",purchaseRoutes)
app.use("/api/v1/progress", progressRoutes)

app.get('/',(req, res) => {
   res.send({
    message: 'Welcome to the LMS API!'  // replace with your message or data
   })    
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

