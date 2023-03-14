const mongoose = require("mongoose");

const drhistory = new mongoose.Schema({
    name :{
        type:String,
        require:true
    },
    hospital :{
        type:String,
        require:true
    },
    phone :{
        type:Number,
        require:true
    },
    bg :{
        type:String
    },
    date:{
        type: Date,
        default: Date.now
    },
    status:{
        type:String,
        default:'pending'
    }
})

const rhist = new mongoose.model("Donorrecievehistory" , drhistory);
module.exports = rhist;