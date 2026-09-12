const express=require('express');
require('dotenv').config()
const app=express();
const cors = require('cors');
// 
const connectDB=require("./config/db");
const authRoute=require('./router/AuthRoute');
const jobRoute=require('./router/JobRoute');
const applicationRoute=require('./router/applicationRoute');
const cookieParser = require("cookie-parser");
// 
const path = require('path');
const PORT= process.env.PORT|| 3001;

app.get('/',(req,res)=>{
    res.send("Respone is sended to welcome page");
    console.log("Welcome");
})


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());

app.use('/api', applicationRoute);
app.use('/api', authRoute);
app.use('/api', jobRoute);
// app.use('/job', jobRoute);


connectDB();


// Serve the built React frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all: any route not matched by the API sends back the React app
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})

