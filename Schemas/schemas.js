const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true,
  },                                   
  email: {
    type: String,
    lowercase: true,
    require: true,
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid Email.",
    ],
  },
});

const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status:{
    type:String,
    trim:true,
    lowercase:true,
    enum:["todo","in-progress","completed"],
    default:"todo"
  },
  title:{
    type:String,
    trim:true,
    require:true
  },
  description:{
    type:String,
    default:null
  },
  startDate:{
    type:String,
    trim:true,
    default:null
  },
  completeDate:{
    type:String,
    trim:true,
    default:null
  }
});
taskSchema.plugin(mongoosePaginate)
const Task = mongoose.model("Task",taskSchema)

module.exports = { User,Task };
