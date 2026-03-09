NotePad - Collaborative Note-Taking MERN App

A premium, ambient collaborative note-taking application built with the MERN stack. Designed for interviews, this project features a glassmorphism UI, real-time-like collaboration feelings, and secure authentication.

Features

- **Ambient Workspace**: Modern glassmorphism design with a dark aesthetic.
- **Rich Text Editing**: Powered by TipTap for a seamless editing experience.
- **JWT Authentication**: Secure user sessions with token-based auth.
- **Google OAuth 2.0**: Sign in/up with a single click using Google.
- **Full-Text Search**: Optimized MongoDB search indexing for notes.
- **Collaboration**: Invite others by email to view and edit notes together.
- **Password Transparency**: Toggle visibility eye-icon for secure password entry.
- **Responsive & Dynamic**: Smooth micro-animations using Framer Motion.

Tech Stack

- **Frontend**: React (Vite), Tailwind CSS 4, Lucide Icons, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Authentication**: JSON Web Token (JWT), Google Auth Library.

---

Getting Started

1. Prerequisites
- **Node.js**: [Download here](https://nodejs.org/)
- **MongoDB**: Atlas Cluster (Cloud) or Local Compass.
- **Google Client ID**: Generate target [Google Cloud Console](https://console.cloud.google.com/).

2. Backend Setup
1. Navigate to the `BACKEND` folder:
   ```bash
   cd BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `BACKEND` folder and fill in your variables:

   **Required Environment Variables (`BACKEND/.env`):**
   ```env
   PORT=8070
   MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/NotePad_db
   JWT_SECRET=8f2c3d5e7b9a1c4d6f8a2b0c3d5e7b9a1c4d6f8a2b0c3d5e7b9a1c4d6f8a2b0c
   JWT_EXPIRES_IN=90d
   GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
   ```
4. Start the backend:
   ```bash
   npm start
   ```

3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the Google Client ID in `frontend/src/main.jsx`:
   ```javascript
   <GoogleOAuthProvider clientId="your_google_client_id_here.apps.googleusercontent.com">
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/users/register` | Create a new account |
| POST | `/api/users/login` | Standard email/password login |
| POST | `/api/users/google-login` | Verify and login with Google |
| GET | `/api/notes` | Get all notes (owned or shared) |
| POST | `/api/notes` | Create a new note |
| PATCH | `/api/notes/:id` | Update note content/title |
| DELETE | `/api/notes/:id` | Delete a note (Owners only) |
| PATCH | `/api/notes/add-collaborator/:id` | Invite user by email |

---

Project Structure
- `BACKEND/`: Express API, Mongoose Models, Controllers, and Routes.
- `frontend/`: React components, Context API for state, and Tailwind styling.
- `README.md`: Project documentation.

**Created by Pramoth Piumal**