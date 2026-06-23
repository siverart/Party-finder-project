const mongoose = require('mongoose');

const partyScheme = new mongoose.Schema({
    roomName: {
        type: String,
        required: [true, 'กรุณาระบุชื่อห้อง'],
        trim: true
    },
    description: {
        type: String,
        default: ''
     },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameName: {
        type: String,
        required: [true, 'กรุณาระบุชื่อเกม'],
        enum: ['Valorant', 'LOL', 'POE2']
    },
    gameMode: {
        type: String,
        default: 'standard'
    },
    rankRequirement: {
        type: Number
    },
    server: {
        type: String,
        enum: ['SEA', 'NA', 'EU', 'OCE', 'LATAM', 'MEA']
    },
    hasMic: {
        type: Boolean,
        default: false
    },
    languages: {
        type: [String]
    },
    minRating: {
        type: Number,
        default: 0
    },
    maxPlayer: {
        type: Number,
        required: true
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    roomStatus: {
        type: String,
        enum: ['waiting','full','complete','cancel'],
        default: 'waiting'
    },
    playTime :{
        start: {type: Date},
        end: {type:Date}
    }
}, { timestamps: true});


module.exports = mongoose.model('Party', partyScheme);



