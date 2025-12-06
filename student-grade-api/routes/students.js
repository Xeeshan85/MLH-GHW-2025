import express from "express";
import Student from "../models/students.js";
import { isValidStudentId } from "../server.js";


const router = express.Router();

// GET /students – Get all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// GET /students/:id – Get a student by ID
router.get("/:id", async (req, res) => {
  const students = await Student.findOne({ id: req.params.id });
  if (!students) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(students);
});

// POST /students – Add a new student
router.post("/", async (req, res) => {
  const { id, name, grades } = req.body;
  
  if (!isValidStudentId(id)) {
    return res.status(400).json({ error: "Invalid student ID format" });
  }
  
  try {
    const newStudent = new Student({ id, name, grades: grades || [] });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /students/:id – Update a student name by ID
router.put("/:id", async (req, res) => {
  const { name } = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { id: req.params.id },
      { name },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /students/:id/grades – Add grades to a student
router.patch("/:id/grades", async (req, res) => {
  const { grades } = req.body;
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    student.grades.push(...grades);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /students/:id – Delete a student by ID
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /students/:id/average – Get a student's average grade
router.get("/:id/average", async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const average =
      student.grades.reduce((sum, g) => sum + g.score, 0) / student.grades.length;
    res.json({ average });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /students/:id/subjects – Get a student's subjects
router.get("/:id/subjects", async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const subjects = student.grades.map((g) => g.course);
    res.json({ subjects });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;