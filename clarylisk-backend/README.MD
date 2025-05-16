# 🚀 Clarylisk Backend API

<div align="center">
  <img src="https://i.imgur.com/YourLogoHere.png" alt="Clarylisk Logo" width="200"/>
  <br>
  <h3>AI-Powered Donation Protection for Content Creators</h3>
  
  [![Deploy Status](https://img.shields.io/badge/deploy-active-success)](https://backend-clarylisk.vercel.app)
  [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
</div>

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🗄️ Database Schema](#%EF%B8%8F-database-schema)
- [🏃‍♂️ Getting Started](#%EF%B8%8F-getting-started)
- [🔌 API Endpoints](#-api-endpoints)
  - [📚 Swagger Documentation](#-swagger-documentation)
  - [🤖 AI Gambling Detection](#-ai-gambling-detection)
  - [👤 User Management](#-user-management)
  - [🧑‍🎨 Creator Services](#-creator-services)
- [⭐ Key Features](#-key-features)
- [📊 Response Examples](#-response-examples)

## ✨ Overview

The Clarylisk Backend powers our Web3 donation platform with advanced AI detection for gambling-related content. This API provides all the necessary endpoints for user management, creator profiles, donation processing, and our core AI moderation system.

## 🗄️ Database Schema

<div align="center">
  <a href="https://drive.google.com/file/d/1KurwPZ5nijn0efekE1CY-hqMWTnSp8Ge/view?usp=sharing" target="_blank">
    <img src="https://i.imgur.com/YourERDiagramPreview.png" alt="ER Diagram Preview" width="500"/>
    <br>
    <b>Click to view full ER Diagram</b>
  </a>
</div>

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/clarylisk/backend.git
cd backend-clarylisk
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and configuration
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The server will be running at `http://localhost:3000`.

## 🔌 API Endpoints

### 📚 Swagger Documentation

Get comprehensive API documentation with examples and testing capabilities.

```
GET https://backend-clarylisk.vercel.app/api-docs-clarylisk/
```

<div align="center">
  <img src="https://i.imgur.com/YourSwaggerScreenshot.png" alt="Swagger UI" width="600"/>
</div>

### 🤖 AI Gambling Detection

Our core AI service that analyzes donation messages to detect gambling promotion content.

#### Analyze Text
```
POST https://backend-clarylisk.vercel.app/ai/ai-clarylisk
```

<details>
<summary><b>View Request/Response Details</b></summary>

**Headers:**
```
Authorization: Bearer {your_token}
```

**Request Body:**
```json
{
  "text": "Great content, keep it up!"
}
```

**Success Response (200):**
```json
{
  "text": "Great content, keep it up!",
  "predicted_label": 0,
  "judol": "no"
}
```

**Gambling Content Detected (200):**
```json
{
  "text": "gw jp 100j",
  "predicted_label": 1,
  "judol": "yes"
}
```
</details>

### 👤 User Management

Complete user authentication and profile management system.

#### Register New User
```
POST https://backend-clarylisk.vercel.app/user/register
```

<details>
<summary><b>View Request/Response Details</b></summary>

**Request Body:**
```json
{
  "username": "clarylisk",
  "password": "securepw123",
  "walletAddress": "0x123abc456def",
  "role": "creator",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
  "facebook": "https://facebook.com/clarylisk",
  "instagram": "https://instagram.com/clarylisk",
  "twitter": "https://twitter.com/clarylisk",
  "youtube": "https://youtube.com/clarylisk",
  "description": "Content creator passionate about blockchain technology"
}
```

**Success Response (200):**
```json
{
  "message": "success registered",
  "walletAddress": "0x123abc456def"
}
```
</details>

#### User Login
```
POST https://backend-clarylisk.vercel.app/user/login
```

<details>
<summary><b>View Request/Response Details</b></summary>

**Request Body:**
```json
{
  "walletAddress": "0x123abc456def",
  "password": "securepw123"
}
```

**Success Response:**
Sets authentication cookie and redirects user
</details>

#### Get User Profile
```
GET https://backend-clarylisk.vercel.app/user/profile
```

<details>
<summary><b>View Request/Response Details</b></summary>

**Headers:**
```
Authorization: Bearer {your_token}
```

**Success Response (200):**
```json
{
  "username": "clarylisk",
  "role": "creator",
  "description": "Content creator passionate about blockchain technology",
  "wallet": [
    {
      "walletAdress": "0x123abc456def"
    }
  ],
  "medsos": [
    {
      "facebook": "https://facebook.com/clarylisk",
      "twitter": "https://twitter.com/clarylisk",
      "instagram": "https://instagram.com/clarylisk",
      "youtube": "https://youtube.com/clarylisk"
    }
  ],
  "image": [
    {
      "image": "https://example.com/avatar.png"
    }
  ]
}
```
</details>

#### Update Profile
```
PATCH https://backend-clarylisk.vercel.app/user/profile
```

<details>
<summary><b>View Request/Response Details</b></summary>

**Headers:**
```
Authorization: Bearer {your_token}
```

**Request Body:** (all fields optional)
```json
{
  "password": "newpassword123",
  "walletAddress": "0xnew123wallet456",
  "facebook": "https://facebook.com/newpage",
  "twitter": "https://twitter.com/newhandle",
  "instagram": "https://instagram.com/newprofile",
  "youtube": "https://youtube.com/newchannel",
  "image": "data:image/jpeg;base64,/9j/NEW_IMAGE_DATA...",
  "description": "Updated creator profile description",
  "role": "creator"
}
```

**Success Response (200):**
```json
{
  "message": "success update profile",
  "data": {
    "idUser": "user123",
    "username": "clarylisk",
    "role": "creator",
    "description": "Updated creator profile description",
    "wallet": {
      "walletAdress": "0xnew123wallet456"
    },
    "medsos": {
      "facebook": "https://facebook.com/newpage",
      "twitter": "https://twitter.com/newhandle",
      "instagram": "https://instagram.com/newprofile",
      "youtube": "https://youtube.com/newchannel"
    },
    "image": {
      "image": "https://example.com/new-avatar.png"
    }
  }
}
```
</details>

#### User Logout
```
POST https://backend-clarylisk.vercel.app/user/logout
```

<details>
<summary><b>View Request/Response Details</b></summary>

**Headers:**
```
Authorization: Bearer {your_token}
Cookie: access_token={your_token}
```

**Success Response (200):**
```json
{
  "message": "Successfully logged out"
}
```
</details>

### 🧑‍🎨 Creator Services

Services specific to content creators and donation management.

#### Get All Creators
```
GET https://backend-clarylisk.vercel.app/creators
```

#### Get Creator by ID
```
GET https://backend-clarylisk.vercel.app/creators/:userId
```

## ⭐ Key Features

- **🛡️ AI-powered gambling content detection** - Our sophisticated machine learning model identifies gambling-related content in donation messages with high accuracy
- **🔐 Secure user authentication** - JWT-based authentication system with proper token management
- **👥 Creator profiles** - Complete profile management for content creators with social media integration
- **⭐ Creator rating system** - Trust scoring that decreases when creators accept gambling-related donations
- **📊 Detailed analytics** - Track donation patterns and gambling detection statistics

## 📊 Response Examples

<details>
<summary><b>AI Detection Example</b></summary>

**Request:**
```bash
curl -X POST https://backend-clarylisk.vercel.app/ai/ai-clarylisk \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"text":"Check out this new site for games jp.com win 100x"}'
```

**Response:**
```json
{
  "text": "Check out this new site for games jp.com win 100x",
  "predicted_label": 1,
  "judol": "yes"
}
```
</details>

---

<div align="center">
  <p>Built with ❤️ by the Clarylisk Team</p>
  
  <a href="https://clarylisk.netlify.app">Website</a> •
  <a href="https://github.com/clarylisk">GitHub</a> •
  <a href="https://backend-clarylisk.vercel.app/api-docs-clarylisk/">API Docs</a>
</div>
