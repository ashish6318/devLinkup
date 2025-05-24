# DevLinkup 🔗

DevLinkup is a full-stack web application designed to connect developers for collaboration on innovative projects, hackathons, and startup ventures. It provides a platform for users to register, create detailed profiles, discover other developers through a matching system, and communicate in real-time via chat.

---

**Live Demo:**

* **Frontend (Vercel):** [https://devlinkup-pearl.vercel.app/](https://devlinkup-pearl.vercel.app/)
* **Backend API Base (Render):** `https://devlinkup.onrender.com/api` (This is the base URL your frontend uses)

---

## ✨ Features

* **User Authentication:** Secure registration and login system using JWT (JSON Web Tokens) with password hashing (bcryptjs).
* **Profile Management:** Users can create, view, and edit detailed profiles including:
    * Name, Profile Picture URL(not mandatory)
    * Skills (comma-separated)
    * Tech Stacks (comma-separated)
    * Experience (brief description)
    * GitHub Profile URL
    * Project Interests (comma-separated)
* **Developer Discovery:** A "swipe-like" interface (on the Discover page) for users to browse other developer profiles and express interest (like) or pass (dislike).
* **Mutual Matching System:** When two users mutually like each other, a match is created.
* **Real-Time Chat:**
    * **Socket.IO:** Powers instant messaging between matched users.
    * **Dedicated Chat Rooms:** Each match gets a unique chat room.
    * **Message Persistence:** Chat messages are saved to the database.
* **Responsive UI:** Modern user interface built with React and styled with Tailwind CSS.
* **Animations & Effects:** Smooth page transitions and interactive elements using Framer Motion.
* **Light/Dark Mode:** Theme toggling for user preference, managed with Context API.
* **Protected Routes:** Backend API routes and frontend routes are protected, requiring authentication.

## 🛠️ Tech Stack

**Frontend:**
* **React (Vite)**
* **React Router:** For client-side navigation.
* **Tailwind CSS:** For utility-first styling.
* **Framer Motion:** For animations and page transitions.
* **Context API:** For global state management (Authentication, Chat, Theme).
* **Axios:** For making HTTP requests to the backend.
* **Socket.IO Client:** For real-time communication.
* **Heroicons:** For UI icons.

**Backend:**
* **Node.js**
* **Express.js:** Web framework for Node.js.
* **MongoDB:** NoSQL database.
* **Mongoose ODM:** For modeling MongoDB data.
* **Socket.IO Server:** For handling real-time WebSocket connections.
* **JSON Web Token (JWT):** For stateless authentication.
* **bcryptjs:** For password hashing.
* **CORS:** For managing cross-origin requests.
* **dotenv:** For managing environment variables.

**Database:**
* **MongoDB Atlas:** Cloud-hosted MongoDB service.

**Deployment:**
* **Frontend:** Vercel
* **Backend:** Render
* **Version Control:** Git & GitHub

---

## 🚀 Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18.x or higher recommended)
* npm or yarn
* MongoDB instance (either local or a free cluster on MongoDB Atlas)
* Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ashish6318/devLinkup.git](https://github.com/ashish6318/devLinkup.git)
    cd devLinkup
    ```

2.  **Backend Setup:**
    * Navigate to the Backend directory :
        ```bash
        cd Backend
        ```
    * Install dependencies:
        ```bash
        npm install
        # or
        yarn install
        ```
    * Create a `.env` file in the `Backend` directory. Copy the contents of `.env.example` (if you have one) or add the following variables:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string # Replace with your local or Atlas URI
        JWT_SECRET=your_strong_random_jwt_secret 
        FRONTEND_URL=http://localhost:5173 # Or your local frontend port if different
        ```
        **Note:** For `MONGO_URI`, ensure you replace `your_mongodb_connection_string` with your actual MongoDB connection string. For `JWT_SECRET`, use a long, random, and strong string.
    * Start the backend development server:
        ```bash
        npm run dev 
        # (This usually runs nodemon server.js, check your package.json)
        # Or `npm start` if your start script is for development too
        ```
        The Backend should now be running (typically on `http://localhost:5000`).

3.  **Frontend Setup:**
    * Navigate to the Frontend/devT directory:
        ```bash
        cd ../frontend
        cd../devT
        # Or from project root: cd Frontend/devT
        ```
    * Install dependencies:
        ```bash
        npm install
        # or
        yarn install
        ```
    * Create a `.env` or `.env.local` file in the `frontend` directory. Add the following variables:
        ```env
        VITE_API_URL=http://localhost:5000/api 
        # (Ensure '/api' is included if your backend routes are prefixed)
        VITE_SOCKET_URL=http://localhost:5000
        ```
        **Note:** `VITE_API_URL` should point to your local backend. If your backend doesn't use an `/api` prefix for all routes, adjust accordingly.
    * Start the frontend development server:
        ```bash
        npm run dev
        # or
        yarn dev
        ```
        The frontend should now be running (typically on `http://localhost:5173`).

### Environment Variables Overview

**Backend (`backend/.env`):**
* `PORT`: Port the backend server will run on (e.g., 5000).
* `MONGO_URI`: Your MongoDB connection string.
* `JWT_SECRET`: Secret key for signing JWTs.
* `FRONTEND_URL`: The URL of your frontend (used for CORS).

**Frontend (`frontend/.env` or `frontend/.env.local`):**
* `VITE_API_URL`: Base URL for your backend API endpoints.
* `VITE_SOCKET_URL`: URL for your backend Socket.IO server.

---



## 🚀 Deployment

This project is deployed with:
* **Frontend:** Vercel (`https://devlinkup-pearl.vercel.app/`)
* **Backend:** Render (`https://devlinkup.onrender.com/`)
* **Database:** MongoDB Atlas (Cloud)

Continuous deployment is set up via GitHub integration with these platforms.

---

## 🤝 Contributing

Currently, contributions are not formally set up. However, if you have suggestions or find bugs, feel free to open an issue on the GitHub repository.

---
---

## 🏗️ Project Structure

```text
/devlinkup                 # Root project folder
├── backend/               # Node.js, Express.js, MongoDB, Socket.IO
│   ├── node_modules/      # (ignored by .gitignore)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env               # (local secrets, ignored)
│   ├── .gitignore
│   ├── package.json
│   └── server.js          # Main backend entry point
│
├── frontend/              # React (Vite) application
│   ├── node_modules/      # (ignored by .gitignore)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx       # Main frontend entry point
│   ├── .env.local         # (local secrets, ignored)
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore             # Root .gitignore (optional)
└── README.md              # This file

## 🧑‍💻 Author

* **Ashish Rajput**
    * GitHub: [@ashish6318](https://github.com/ashish6318)
    * LinkedIn: [https://www.linkedin.com/in/ashishrajput0904/] * Email: [aashishrajput0904@gmail.com] ---

## 📝 License

This project is open-source. Feel free to use it as inspiration or for learning purposes. If you plan to use significant portions, please give credit.
(Consider adding a specific license file, e.g., MIT License, if you wish.)

---

Assuming a monorepo structure:
