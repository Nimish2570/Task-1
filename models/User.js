//User schema with role
const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }, 

    username: {
        type: String,
        required: true,
        
    },

    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,

        enum: ['SuperAdmin', 'Admin', 'Client'],
    },
});



userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},"HWIAFJKSSADASDASDASASDASDASDASDASDDBFASJKBAIU",{
        expiresIn:'5d',
    })
}




const User = mongoose.model('User', userSchema);

module.exports = User;