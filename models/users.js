const mongoose = require('mongoose')
const {Schema} = mongoose

const checkEmail = (value) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
  {
    return (true)
  }
    return (false)
}

const checkPassword = (value) => {
    // if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}/.test(value))
    // {
        return (true)
    //   }
    //     return (false)
}

const UserSchema = new Schema({
    firstName : {
        type :String,
        trim : true,
        require : true
    },
    email : {
        type : String,
        trim : true,
        require : true,
        validate: {
            validator: checkEmail,
            message: props => `${props.value} is not a valid Email!`
        },
    },
    password : {
        type : String,
        trim : true,
        require : true,
        validate: {
            validator: checkPassword,
            message: props => `${props.value} is not a valid Password!`
        },
    },
    token : String
})

const User = mongoose.model('User',UserSchema)

module.exports = User