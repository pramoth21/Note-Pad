# NotePad Backend - Collaborative Note-Taking API

This is a robust backend for the NotePad application, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **JWT Authentication**: Secure user registration and login.
- **Collaborative Notes**: Users can create, edit, and delete notes.
- **Collaborator Management**: Note owners can add or remove collaborators by email.
- **Full-Text Search**: Search notes by title or content.
- **MVC Architecture**: Clean and maintainable code structure.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB (Local or Atlas)

# Setup

1. Clone the repository.
2. Navigate to the `BACKEND` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure `.env` file:
   ```env
   PORT=8070
   MONGODB_URL=your_mongodb_url

5. Start the server:
   ```bash
   npm start
   ```
# Tech Stack

- **Node.js & Express**: Backend framework.
- **MongoDB & Mongoose**: Database and ODM.
- **JWT & Bcryptjs**: Authentication and security.
- **Validator**: Input validation.


**removed .env file from github repo for privacy**