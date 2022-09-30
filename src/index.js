require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/personModel");
const errorHandler = require("./middleware/errorHandler");
const unknownEndpoint = require("./middleware/unknownEndpoint");

/* Express and middleware */
const app = express();
app.use(cors());
app.use(express.json());

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else return "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/* Routes */
app.get("/info", (request, response) => {
  Person.countDocuments({}, (err, count) => {
    response.send(
      `<h1>Phonebook has info for ${count} people</h1><h1>${Date().toString()}</h1>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.post("/api/persons", (request, response, next) => {
  const person = new Person(request.body);
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  Person.findByIdAndUpdate(request.params.id, body, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

/* Error middleware */
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
