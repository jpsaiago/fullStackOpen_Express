const express = require("express");
const app = express();

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

app.get("/", (request, response) => {
  response.json(people);
});

app.get("/info", (request, response) => {
  response.send(
    `<h1>Phonebook has info for ${
      people.length
    } people</h1><h1>${Date().toString()}</h1>`
  );
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

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
