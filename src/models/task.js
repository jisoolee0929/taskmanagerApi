const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        trim: true,
        required:true,
    },
    completed: {
        type: Boolean,
        required: false,
        default: false,
    },
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'

    }
}, {
    timestamps:true
})


taskSchema.pre('save' ,async function (next) {
    next()

})

const Tasks = mongoose.model("Tasks", taskSchema )



module.exports = Tasks