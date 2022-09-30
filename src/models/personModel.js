const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@fullstackopenexpress.ome6tsw.mongodb.net/?retryWrites=true&w=majority`;

/*Mongoose setup */
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true, unique: true },
  phoneNumber: {
    type: String,
    minLength: 8,
    validate: [
      (val) => /^[0-9]{2,3}-[0-9]+$/.test(val),
      "Sorry, number must be of format xx-xxxxxxxx or xxx-xxxxxxxx",
    ],
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
