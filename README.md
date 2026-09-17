# Testimonial Social Proof Collector

A comprehensive, full-stack MERN platform that enables businesses to effortlessly collect, moderate, and showcase customer testimonials.

## Features

- **Authentication System**: Secure JWT-based access and refresh tokens via httpOnly cookies.
- **Space Management**: Create dedicated URLs with custom branding to collect reviews.
- **Public Collection Page**: A beautiful, unauthenticated form for customers to leave reviews and upload avatars.
- **Dashboard & Moderation**: Approve, reject, feature, and like incoming testimonials.
- **Analytics**: Visualize your average ratings, total review counts, and star distributions.
- **Wall of Love**: A public, masonry-grid layout showcasing all your approved testimonials.
- **Embed Generator**: One-click generation of customizable iframe HTML code to inject the Wall of Love into any external website.

## Technology Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios
- Vanilla CSS (Custom Premium Design System)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Multer (Multipart Image Uploads)
- Express Validator

## Project Architecture

This repository uses a Monorepo-style structure, split between the client (React) and server (Node/Express). 

```text
testimonial-social-proof/
│
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
├── server/          # Node + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
```

## Installation & How to Run

1. **Clone the repository**

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory (reference `.env.example`).
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## Environment Variables

See `server/.env.example`. Do not commit passwords, API keys, or database credentials.

## API Documentation

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT tokens
- `POST /api/auth/refresh` - Rotate access tokens
- `GET /api/spaces` - Fetch owner's spaces
- `POST /api/spaces` - Create a new space
- `POST /api/public/spaces/:slug/testimonials` - Submit a new review (multipart/form-data)
- `GET /api/public/spaces/:slug/wall` - Fetch approved reviews for the Wall of Love
- `PATCH /api/testimonials/:id/approve` - Approve a review

## Assumptions & Limitations
- Images are stored locally on the server file system in the `uploads/` folder via Multer. For production, integration with an S3 bucket or Cloudinary is recommended.
- The Embed iframe is currently responsive but should be restricted by CORS policies in a real production environment.
