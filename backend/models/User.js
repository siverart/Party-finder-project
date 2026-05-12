const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'กรุณาระบุชื่อผู้ใช้'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required:[true, 'กรุณาระบุรหัสผ่าน']
    },
    email: {
        type: String,
        required: [true, 'กรุณาระบุอีเมล'],
        unique: true,
        lowercase: true
    },
    displayName: {
        type: String
    },
    description: {
        type: String,
        default: ''
    },
    contacts: [
        {
            platform: {type: String, enum: ['Facebook', 'Instagram', 'Steam', 'Line', 'Varolant', 'LOL' ]},
            value: {type: String},
            isShare: {type: Boolean, default: false}
        }
    ],
    tags: {
        type: [String],
        validate: [v => v.length <= 15, 'คุณสามารถใส่แท๊กได้สูงสุด 15 แท๊ก']
    },
    isActive: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    rating: {
        score: { type: Number, default: 100},
        reportCounts: {
            throwing: {type: Number, default: 0},
            toxic: {type: Number, default: 0},
            afk: {type: Number, default: 0}
        }
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    activationToken: String,
    activationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

userScheme.pre('save', function(next) {
    if (!this.displayName) {
        this.displayName = this.username;
    }
    next();
});

userScheme.index({isOnline: 1})
module.exports = mongoose.model('User', userScheme);