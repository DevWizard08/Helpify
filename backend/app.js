const express  = require('express');
const mongoose = require('mongoose');
const dotnev = require('dotenv');
const cors = require('cors');

dotnev.config({path: "./config/config.env"});

const app = express();
const PORT = process.env.PORT || 5000;


//middleware
app.use(express.json());
app.use(cors());

//connection to mongo db
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser : true,
    useUnifiedTopology :true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


app.get('/' , (req,res) => {
    res.send('Ambulance booking API');
}) 

const authRoutes = require('./Routes/auth.js');
app.use('/api/auth',authRoutes);

const ambulanceRoutes = require('./Routes/ambulance.js');
app.use('/api/ambulance',ambulanceRoutes);

const userRoutes = require('./Routes/user.js');
app.use('/api/user',userRoutes);


app.listen(PORT,() =>console.log(`Server is runnign on ${PORT}`));


