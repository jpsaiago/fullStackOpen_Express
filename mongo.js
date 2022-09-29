const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@fullstackopenexpress.ome6tsw.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const Person = mongoose.model("Note", personSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
    if (process.argv[3] && process.argv[4]) {
      const person = new Person({
        name: process.argv[3],
        phoneNumber: process.argv[4],
      });
      return person.save();
    } else
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(person);
        });
        mongoose.connection.close();
      });
  })
  .then(() => {
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
