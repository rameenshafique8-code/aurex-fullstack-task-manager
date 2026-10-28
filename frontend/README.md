Aurex Full-Stack Internship – Week 4

Full-Stack Task Management Application

Intern Information

- Intern Name: Rameen Shafique
- Domain: Full-Stack Web Development
- Week: Week 4
- Project: Task Management Application

1. Project Overview

The Task Management Application is a full-stack web application that allows users to register, log in, and manage their personal tasks. Users can create, view, update, complete, and delete tasks through a responsive React interface.

The backend handles authentication and task operations, while MongoDB stores user and task data.

2. Technologies Used

- Frontend: React.js, JavaScript, HTML5, CSS3
- Frontend Development Tool: Vite
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JSON Web Token (JWT)
- Password Security: bcryptjs
- API Testing: Postman
- Code Editor: Visual Studio Code
- Version Control: Git and GitHub

3. Project Features

- User registration
- User login and logout
- Password hashing
- JWT-based authentication
- Create new tasks
- View saved tasks
- Update task information
- Mark tasks as completed or incomplete
- Delete tasks
- Display task statistics
- User-specific task management
- Responsive user interface
- Store and retrieve task data through the backend API

4. Project Folder Structure

aurex-fullstack-project-rameen/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md

Note: The structure above represents the main project files. Keep any additional files already present in your project.

5. Installation and Setup

Prerequisites

- Node.js and npm
- MongoDB connection
- Visual Studio Code

Step 1: Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd aurex-fullstack-project-rameen

Replace "YOUR_GITHUB_REPOSITORY_URL" with your actual GitHub repository URL.

Step 2: Install backend dependencies

cd backend
npm install

Step 3: Configure environment variables

Create a ".env" file inside the "backend" folder and add your own configuration:

PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_PRIVATE_SECRET

Use your actual MongoDB connection string and a strong private JWT secret. Never upload the real ".env" file or credentials to GitHub.

Step 4: Start the backend

From the "backend" folder, run:

npm run dev

If the development script is unavailable, use:

node server.js

The backend should run at:

"http://localhost:5000"

Step 5: Install frontend dependencies

Open a second terminal in Visual Studio Code and run:

cd frontend
npm install

Step 6: Start the frontend

npm run dev

Open the local URL displayed by Vite, usually:

"http://localhost:5173"

Make sure the backend and MongoDB connection are running before testing the application.

6. API Endpoints

Method| Endpoint| Purpose
POST| "/api/auth/register"| Register a new user
POST| "/api/auth/login"| Log in a user
GET| "/api/auth/me"| Retrieve the authenticated user
GET| "/api/tasks"| Retrieve the user's tasks
POST| "/api/tasks"| Create a task
PUT| "/api/tasks/:id"| Update a task
DELETE| "/api/tasks/:id"| Delete a task

Protected endpoints require a valid authentication token.

7. Testing

The application can be tested by performing the following checks:

- Register a new account.
- Log in with valid credentials.
- Verify that invalid login credentials are rejected.
- Create a new task.
- View the task list.
- Edit a task.
- Mark a task as completed and incomplete.
- Delete a task.
- Log out and log in again.
- Verify that a user can access only their own tasks.
- Check the layout on desktop and mobile screens.
- Test backend API endpoints using Postman.

8. Challenges Faced

- Connecting the React frontend with the Express backend.
- Configuring the MongoDB database connection.
- Implementing user registration and login.
- Handling authentication tokens and protected routes.
- Connecting task operations with the database.
- Troubleshooting API and frontend connection errors.

9. Key Learnings

- Understanding React components and state management.
- Connecting a frontend application to a REST API.
- Building backend routes and controllers with Express.js.
- Working with MongoDB models using Mongoose.
- Implementing password hashing and JWT authentication.
- Performing CRUD operations.
- Testing APIs with Postman.
- Organizing a full-stack project into separate frontend and backend folders.
- Identifying and fixing application errors.

10. Deployment

Frontend Live URL: http://localhost:5173/

GitHub Repository: https://github.com/rameenshafique8-code/aurex-fullstack-task-manager.git

The frontend and backend must be configured to communicate with each other in the deployed environment. The production backend must use secure environment variables and an accessible MongoDB database.

11. Conclusion

This project provided practical experience in developing a full-stack task management application using React.js, Node.js, Express.js, and MongoDB. It helped strengthen my understanding of frontend development, backend APIs, authentication, database integration, CRUD operations, and application testing.
