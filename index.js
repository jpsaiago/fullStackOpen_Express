const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else return "";
});

const people = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
];

app.get("/info", (request, response) => {
  response.send(
    `<h1>Phonebook has info for ${
      people.length
    } people</h1><h1>${Date().toString()}</h1>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(people);
});

app.post("/api/persons", (request, response) => {
  const person = { id: Math.floor(Math.random() * 10000), ...request.body };
  if (!person.name || !person.number) {
    response.status(400).json({ error: "Missing information." });
  }
  if (people.some((p) => p.name === person.name)) {
    response.status(400).json({ error: "Person already exists." });
  } else {
    people.push(person);
    response.status(201).end();
  }
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  people.splice(
    people.findIndex((i) => i.id === id),
    1
  );
  response.status(200).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
