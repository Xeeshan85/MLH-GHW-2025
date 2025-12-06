# Student Grade API

Built for GHW: API Week (November 2025). A RESTful API for managing student information and their grade records. This is an introductory API build focusing on documenting and deploying a high-quality API.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Data Structure](#data-structure)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)

## Features

- 📚 **Student Management** - Create, read, update, and delete student records
- 📊 **Grade Tracking** - Manage grades for multiple subjects per student
- 📈 **Grade Analytics** - Calculate average grades and retrieve specific subject grades
- 💾 **Persistent Storage** - All data is saved to a JSON file
- 🔒 **CORS Enabled** - Cross-origin requests supported
- ⚡ **Express.js** - Built on the popular Node.js web framework

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Xeeshan85/student-grade-api.git
cd student-grade-api
```

2. Install dependencies:
```bash
npm install
```

## Getting Started

### Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Start the Production Server

```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3001
```

### 1. Get All Students
**Endpoint:** `GET /students`

**Description:** Retrieve a list of all students

**Response:** `200 OK`
```json
[
  {
    "id": "S2025001",
    "name": "Alice Johnson",
    "grades": [
      {
        "subject": "MATH-101: Algebra I",
        "score": 92
      },
      {
        "subject": "SCI-201: Biology",
        "score": 85
      }
    ]
  }
]
```

---

### 2. Get Student by ID
**Endpoint:** `GET /students/:id`

**Description:** Retrieve a specific student by their ID

**Parameters:**
- `id` (string, required) - Student ID (e.g., `S2025001`)

**Response:** `200 OK`
```json
{
  "id": "S2025001",
  "name": "Alice Johnson",
  "grades": [...]
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Student not found"
}
```

---

### 3. Create a New Student
**Endpoint:** `POST /students`

**Description:** Add a new student to the database

**Request Body:**
```json
{
  "id": "S2025010",
  "name": "John Doe",
  "grades": [
    {
      "subject": "MATH-101: Algebra I",
      "score": 90
    },
    {
      "subject": "SCI-201: Biology",
      "score": 87
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "S2025010",
  "name": "John Doe",
  "grades": [...]
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields (id, name, or grades)
- `409 Conflict` - Student with this ID already exists

---

### 4. Update a Student
**Endpoint:** `PUT /students/:id`

**Description:** Update an existing student's information

**Parameters:**
- `id` (string, required) - Student ID

**Request Body:**
```json
{
  "id": "S2025001",
  "name": "Alice Johnson",
  "grades": [
    {
      "subject": "MATH-101: Algebra I",
      "score": 95
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": "S2025001",
  "name": "Alice Johnson",
  "grades": [...]
}
```

**Error Response:** `404 Not Found`

---

### 5. Delete a Student
**Endpoint:** `DELETE /students/:id`

**Description:** Remove a student from the database

**Parameters:**
- `id` (string, required) - Student ID

**Response:** `200 OK`
```json
{
  "id": "S2025001",
  "name": "Alice Johnson",
  "grades": [...]
}
```

**Error Response:** `404 Not Found`

---

### 6. Get All Grades for a Student
**Endpoint:** `GET /students/:id/grades`

**Description:** Retrieve all grades for a specific student

**Parameters:**
- `id` (string, required) - Student ID

**Response:** `200 OK`
```json
[
  {
    "subject": "MATH-101: Algebra I",
    "score": 92
  },
  {
    "subject": "SCI-201: Biology",
    "score": 85
  }
]
```

**Error Response:** `404 Not Found`

---

### 7. Get a Specific Grade by Subject
**Endpoint:** `GET /students/:id/grades/:subject`

**Description:** Retrieve a specific grade for a student by subject

**Parameters:**
- `id` (string, required) - Student ID
- `subject` (string, required) - Subject name (must match exactly)

**Response:** `200 OK`
```json
{
  "subject": "MATH-101: Algebra I",
  "score": 92
}
```

**Error Responses:**
- `404 Not Found` - Student not found
- `404 Not Found` - Grade not found for the specified subject

---

### 8. Get Average Grade for a Student
**Endpoint:** `GET /students/:id/average`

**Description:** Calculate the average grade across all subjects for a student

**Parameters:**
- `id` (string, required) - Student ID

**Response:** `200 OK`
```json
{
  "average": 88.5
}
```

**Error Response:** `404 Not Found`

---

## Data Structure

### Student Object
```json
{
  "id": "S2025001",
  "name": "Alice Johnson",
  "grades": [
    {
      "subject": "MATH-101: Algebra I",
      "score": 92
    }
  ]
}
```

### Grade Object
```json
{
  "subject": "MATH-101: Algebra I",
  "score": 92
}
```

**Field Descriptions:**
- `id` (string) - Unique student identifier
- `name` (string) - Student's full name
- `grades` (array) - Array of grade objects
- `subject` (string) - Course name and code
- `score` (number) - Numeric grade (0-100)

---

## Usage Examples

### Using cURL

**Get all students:**
```bash
curl http://localhost:3001/students
```

**Get a specific student:**
```bash
curl http://localhost:3001/students/S2025001
```

**Create a new student:**
```bash
curl -X POST http://localhost:3001/students \
  -H "Content-Type: application/json" \
  -d '{
    "id": "S2025010",
    "name": "John Doe",
    "grades": [
      {
        "subject": "MATH-101: Algebra I",
        "score": 90
      }
    ]
  }'
```

**Update a student:**
```bash
curl -X PUT http://localhost:3001/students/S2025001 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "S2025001",
    "name": "Alice Johnson",
    "grades": [
      {
        "subject": "MATH-101: Algebra I",
        "score": 95
      }
    ]
  }'
```

**Delete a student:**
```bash
curl -X DELETE http://localhost:3001/students/S2025001
```

**Get student average:**
```bash
curl http://localhost:3001/students/S2025001/average
```

---

## Error Handling

The API returns standard HTTP status codes:

| Status Code | Description |
|---|---|
| `200 OK` | Successful request |
| `201 Created` | Resource successfully created |
| `400 Bad Request` | Invalid request data or missing required fields |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource already exists |

Error responses include a message:
```json
{
  "message": "Error description"
}
```

---

## Project Structure

```
student-grade-api/
├── data/
│   └── students.json       # Student data storage
├── routes/
│   └── students.js         # Student endpoints
├── server.js               # Express server setup
├── package.json            # Project dependencies
└── README.md               # This file
```

---

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **JSON** - Data format

---

## License

ISC

---

## Author

Xeeshan85

---

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/Xeeshan85/student-grade-api)
