const express = require('express');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory array to store student records
let students = [
  { id: 1, name: "Prince Kandari", course: "Computer Science", age: 21 },
  { id: 2, name: "Alice Smith", course: "Data Science", age: 22 },
  { id: 3, name: "Bob Johnson", course: "Cyber Security", age: 20 }
];

// GET / - Welcome message
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome to the Student Management API!",
    version: "1.0.0",
    endpoints: {
      "GET /": "Welcome message",
      "GET /students": "Get all students",
      "GET /students/:id": "Get a student by ID",
      "POST /students": "Add a new student",
      "DELETE /students/:id": "Delete a student by ID"
    }
  });
});

// GET /students - Return all students
app.get('/students', (req, res) => {
  res.status(200).json(students);
});

// GET /students/:id - Return a particular student by ID
app.get('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: `Student with ID ${req.params.id} not found` });
  }

  res.status(200).json(student);
});

// POST /students - Add a new student
app.post('/students', (req, res) => {
  const { name, course, age } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required to add a student" });
  }

  // Generate unique ID
  const newId = req.body.id
    ? parseInt(req.body.id, 10)
    : (students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1);

  const newStudent = {
    id: newId,
    name,
    course: course || "General",
    age: age ? parseInt(age, 10) : 20
  };

  students.push(newStudent);

  res.status(201).json({
    message: "Student added successfully",
    student: newStudent
  });
});

// DELETE /students/:id - Delete a student
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ error: `Student with ID ${req.params.id} not found` });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  res.status(200).json({
    message: "Student deleted successfully",
    student: deletedStudent
  });
});

// Port and Host configuration
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
  });
}

module.exports = app;
