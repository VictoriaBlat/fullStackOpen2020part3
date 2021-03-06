const { response } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
// app.use(morgan("tiny"));
app.use(express.json());

morgan.token("returnBody", function getId(req) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :returnBody"
  )
);
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const info = `Phonebook has info for ${persons.length} people ${new Date()}`;
  res.json(info);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });
  if (person) {
    res.json(person);
  } else {
    return res.status(404).end("Person not found");
  }
  console.log(person);
  console.log(id, typeof id);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const genID = () => {
    let maxId =
      persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
    return maxId;
  };
  const body = req.body;
  let notUnique = persons.find((person) => {
    if (person.name === body.name) {
      return true;
    }
  });
  // let isUnique = true;
  // if (!body.name || !body.number)
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  } else if (notUnique) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: genID(),
  };
  console.log("body.name", typeof body.name);
  // person.id = Math.floor(Math.random() * (1000000 - maxId) + maxId);
  persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
