const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", //Comes from Model
  },
});
// MAKING INSTANCE METHOD
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
  findActiveCallback: function (cb) {
    return mongoose.model("Todo").find({ status: "active" }, cb);
  },
};
//MAKING STATIC METHOD -- searching talukder in Title
todoSchema.statics = {
  findByTalukder: function () {
    return this.find({ title: /talukder/i });
    // [/talukder/i]- Regular expression(Backend it uses: new RegExp(language, "i"))
  },
};
// QUERY HELPERS
todoSchema.query = {
  byAuthor: function (author) {
    return this.find({ title: new RegExp(author, "i") }); // [/talukder/i]- Regular expression
  },
};

module.exports = todoSchema;
