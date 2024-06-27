const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
    },
    email:{
        type: String, unique: true,
    },
    password:{
        type: String, 
    },
    cartData:{
        type:Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model('User', userSchema);

module.export = User;