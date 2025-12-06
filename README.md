# MLH GHW 2025 - Code Projects

Welcome to the MLH GHW 2025 Codes repository! This collection contains various projects built during GitHub World Week (November 2025), showcasing different technologies and concepts including APIs, authentication, vector search, and more.

## 📚 Projects Overview

### 1. **student-grade-api** ⭐ 
A comprehensive RESTful API for managing student information and grades.

**Quick Info:** Node.js + Express + MongoDB + JWT Authentication  
**Status:** ✅ Production Ready (Deployed on Render)  
**📖 Full Documentation:** [student-grade-api/README.md](./student-grade-api/README.md)

```bash
cd student-grade-api
npm install
npm start
```

---

### 2. **auth0** 🔐
Python Flask web app with Auth0 authentication integration.

**Quick Info:** Python + Flask + Auth0 OAuth 2.0  
**Status:** ✅ Complete  
**📖 Full Documentation:** 
- [auth0/README.md](./auth0/README.md)
- [auth0/SETUP_GUIDE.md](./auth0/SETUP_GUIDE.md)
- [auth0/QUICKSTART.md](./auth0/QUICKSTART.md)

```bash
cd auth0
pip install -r requirements.txt
python server.py
```

---

### 3. **vector-search** 🔍
MongoDB Atlas Vector Search implementation with Python.

**Quick Info:** Python + PyMongo + MongoDB Vector Search  
**Status:** ✅ Functional  
**📖 Full Documentation:** [vector-search/README.md](./vector-search/README.md) (if available)

```bash
cd vector-search
pip install -r requirements.txt
python vector-index.py
```

---

### 4. **postcard** 📮
Image generation API built with Cloudflare Workers.

**Quick Info:** TypeScript + Cloudflare Workers  
**Status:** ✅ Functional  
**📖 Full Documentation:** [postcard/README.md](./postcard/README.md)

```bash
cd postcard/image-generation-api
npm install
wrangler deploy
```

---

### 5. **mongo** 🗄️
MongoDB and Node.js basic integration examples.

**Quick Info:** Node.js + Python + MongoDB  
**Status:** ✅ Examples  
**📖 Full Documentation:** See folder for examples

---

### 6. **Xeeshan85** 👤
Personal portfolio/profile directory.

**📖 Documentation:** [Xeeshan85/README.md](./Xeeshan85/README.md)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (for Node projects)
- Python 3.9+ (for Python projects)
- Git

### Quick Setup

```bash
# Clone and navigate
git clone https://github.com/Xeeshan85/MLH-GHW-2025.git
cd Codes

# Install dependencies for your project
cd <project-folder>
npm install      # for Node projects
# OR
pip install -r requirements.txt  # for Python projects

# Configure .env (see project-specific README)
cp .env.example .env

# Run the project
npm start        # for Node
python server.py # for Python
```

---

## 📋 Project Documentation Matrix

| Project | Main README | Setup Guide | Tech Stack |
|---------|------------|------------|-----------|
| student-grade-api | [README.md](./student-grade-api/README.md) | See main README | Node.js, MongoDB, Express |
| auth0 | [README.md](./auth0/README.md) | [SETUP_GUIDE.md](./auth0/SETUP_GUIDE.md) | Python, Flask, Auth0 |
| vector-search | [README.md](./vector-search) | [README.md](./vector-search) | Python, MongoDB, Vector Search |
| postcard | [README.md](./postcard/README.md) | [README.md](./postcard/image-generation-api) | TypeScript, Cloudflare Workers |
| mongo | [Examples](./mongo) | N/A | Node.js, Python, MongoDB |
| Xeeshan85 | [README.md](./Xeeshan85/README.md) | N/A | Profile |

**📌 For detailed information about each project, please visit the individual project's README.**

---

## 🏗️ Project Structure

```
Codes/
├── student-grade-api/        # RESTful API for student grades
│   └── README.md            # Full documentation
│
├── auth0/                    # Auth0 Flask integration
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   └── QUICKSTART.md
│
├── vector-search/           # MongoDB Vector Search
│   └── README.md or examples
│
├── postcard/                # Image generation API
│   └── image-generation-api/
│       └── README.md
│
├── mongo/                   # MongoDB examples
│   └── Examples and scripts
│
├── Xeeshan85/               # Profile
│   └── README.md
│
├── .gitignore              # Comprehensive git rules
└── README.md               # This file
```

---

## 🔑 Key Technologies

- **Backend:** Node.js, Express, Python, Flask
- **Databases:** MongoDB Atlas, Vector Search
- **Authentication:** Auth0, JWT, bcrypt
- **Cloud:** Cloudflare Workers, Render, MongoDB Atlas
- **Languages:** JavaScript, TypeScript, Python

---

## 🧪 Testing Projects

See individual project READMEs for:
- API endpoint examples
- Testing with cURL or Postman
- Integration tests
- Deployment instructions

---

## 🔒 Security

⚠️ **Important:**
- Never commit `.env` files (see `.gitignore`)
- Keep secrets in environment variables only
- Use HTTPS in production
- See individual project docs for security best practices

---

## � Support & Resources

For detailed information, setup instructions, and troubleshooting:
1. **Check the project's individual README.md**
2. **Review the project's documentation folder**
3. **See project-specific setup guides**

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

---

## 👨‍💻 Author

**Xeeshan85**
- GitHub: [@Xeeshan85](https://github.com/Xeeshan85)
- Repository: [MLH-GHW-2025](https://github.com/Xeeshan85/MLH-GHW-2025)

---

**Last Updated:** December 6, 2025  
**Version:** 1.0.0  
**Status:** Complete ✅

