# Cassani Trello API

A robust RESTful API for a Trello-like application, built with Node.js, Express, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Real-time Features](#real-time-features)
- [Authentication](#authentication)
- [External Services](#external-services)

## Overview

Cassani Trello API is a feature-rich backend that provides all the necessary functionality for a project management application similar to Trello. It includes board management, columns, cards, user authentication, and real-time notifications via WebSockets.

## Features

- **User Management**: Registration, authentication, profile management
- **Board Operations**: Create, read, update, delete boards
- **Column Management**: Organize boards with columns
- **Card System**: Create and manage cards within columns
- **Drag and Drop**: Support for moving cards between columns
- **Invitations**: Invite users to collaborate on boards
- **Real-time Updates**: Socket.IO integration for live updates
- **File Uploads**: Cloudinary integration for file storage
- **Email Notifications**: Brevo integration for sending emails

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Real-time Communication**: Socket.IO
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Email Service**: Brevo
- **Development Tools**: Babel, ESLint, Nodemon

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middlewares/      # Custom middleware functions
├── models/           # Database models
├── providers/        # External service providers
├── routes/           # API routes
│   ├── v1/           # API version 1
│   └── v2/           # API version 2 (for future expansion)
├── services/         # Business logic
├── sockets/          # Socket.IO event handlers
├── utils/            # Utility functions
├── validations/      # Request validation schemas
└── server.js         # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18.16.0 or higher)
- MongoDB
- Cloudinary account (for file uploads)
- Brevo account (for email notifications)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dlpit/cassani-trello-api
   cd cassani-trello-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see section below)

4. Run the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# App
PORT=<production-port>
LOCAL_DEV_APP_HOST=localhost
LOCAL_DEV_APP_PORT=8017
BUILD_MODE=dev
AUTHOR=<your-name>

# MongoDB
MONGODB_URI=<your-mongodb-connection-string>

# JWT
JWT_SECRET_KEY=<your-jwt-secret-key>
JWT_REFRESH_KEY=<your-jwt-refresh-key>
JWT_ACCESS_EXPIRATION=<expiration-time>
JWT_REFRESH_EXPIRATION=<refresh-expiration-time>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# Brevo (Email)
BREVO_API_KEY=<your-brevo-api-key>
EMAIL_FROM=<sender-email>
EMAIL_SENDER_NAME=<sender-name>
```

## API Documentation

### Base URL

- Development: `http://localhost:8017/v1`
- Production: Depends on deployment

### Endpoints

#### Authentication

- `POST /v1/users/register` - Register a new user
- `POST /v1/users/login` - Login and receive JWT tokens
- `POST /v1/users/refresh-token` - Refresh access token

#### Boards

- `GET /v1/boards` - Get all boards
- `POST /v1/boards` - Create a new board
- `GET /v1/boards/:id` - Get board details
- `PUT /v1/boards/:id` - Update board
- `DELETE /v1/boards/:id` - Delete board

#### Columns

- `POST /v1/columns` - Create a new column
- `PUT /v1/columns/:id` - Update column
- `DELETE /v1/columns/:id` - Delete column

#### Cards

- `POST /v1/cards` - Create a new card
- `PUT /v1/cards/:id` - Update card
- `DELETE /v1/cards/:id` - Delete card

#### Invitations

- `POST /v1/invitations` - Invite user to a board
- `GET /v1/invitations` - Get invitations for current user
- `PUT /v1/invitations/:id/accept` - Accept invitation
- `PUT /v1/invitations/:id/reject` - Reject invitation

## Real-time Features

The API uses Socket.IO for real-time communication. Current real-time events include:

- Board invitation notifications
- Card movements between columns
- Board updates

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- Access tokens for API requests
- Refresh tokens for obtaining new access tokens
- Cookie-based token storage

## External Services

### Cloudinary

Used for storing file attachments and images.

### Brevo

Used for sending email notifications to users.

---

© 2025 Cassani Trello API
