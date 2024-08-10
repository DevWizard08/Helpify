const mongoose = require('mongoose');


const AmbulanceSchema = new mongoose.Schema({
    driverName:{
        type: String,
        required:true
    },
    contact:{
        type: String,
        required:true
    },
    location:{
        type:{
            type: String,
            default:'Point'
        },
        coordinates:{type:[Number],default:[0,0]}
    },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    availability: { type: Boolean, required: true }
});

AmbulanceSchema.index({location: '2dsphere'});


module.exports = mongoose.model('Ambulance',AmbulanceSchema);