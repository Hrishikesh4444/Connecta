# 🌐Connecta – Social Networking Platform

Connecta is a full-stack social networking web application inspired by platforms like LinkedIn, where users can create profiles, connect with others, and share posts.



## 👤 User Features

- User authentication (Login / Register)
- Create and update profile
- View other users' profiles
- Send and manage connection requests
- View connection status (Pending / Connected)
- Create and view posts
- View posts of specific users
- Download user resume



## Tech Stack

**Frontend:** Next.js, Redux, CSS

**Backend:** Node.js, Express.js

**Database** MongoDB

**Other Tools** Axios JWT Authentication



## Project Structure
```bash
connecta/
│
├── frontend/                     # Next.js frontend
│   ├── src/
│   │   ├── components/           # Reusable UI 
│   │   ├── layout/               # Layouts (UserLayout, 
│   │   ├── pages/                # Routing (Next.js)
│   │   │   ├── api/              # API routes (if any)
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── discover/
│   │   │   ├── connections/
│   │   │   ├── profile/
│   │   │   │   └── [username].js # Dynamic profile page
│   │   │   ├── _app.js           # Global wrapper
│   │   │   ├── _document.js
│   │   │   └── index.js          # Home page
│   │   │
│   │   ├── redux/                # State management
│   │   │   ├── action/
│   │   │   ├── reducer/
│   │   │   └── store.js
│   │   ├── styles/               # CSS files
│   │
│   └── package.json
│
├── backend/                      # Node.js + Express backend
│   ├── controllers/              # Business logic
│   ├── routes/                   # API routes
│   ├── models/                   # MongoDB schemas
│   ├── middleware/               # Auth, error handling
│   ├── config/                   # DB connection, configs
│   ├── uploads/                  # Images / resumes
│   └── server.js                 # Entry point
│
├── README.md
└── package.json (optional root config)
```
## Installation

1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/connecta.git
```
2️⃣ Install backend dependencies
```bash
cd backend
npm install
```
3️⃣ Install frontend dependencies
```bash
cd frontend
npm install
```
    
## ▶️Run the Project

Start Backend
```bash
cd backend
npm run server
```
Start Frontend
```bash
cd frontend
npm run dev
```
## Demo

Demo: http://connecta-nine.vercel.app


## Learning Outcomes

- Building full-stack applications using Next.js and MERN stack
- Implementing dynamic routing in Next.js
- Server-side rendering for better performance and SEO
- Managing global state using Redux
- Designing scalable backend APIs
- Handling authentication using JWT
- Real-world feature implementation (connections, profiles, posts)
