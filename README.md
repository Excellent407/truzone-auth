# Truzone Auth Service

This service handles **signup, verification, and login** for Truzone users.
It connects to your MongoDB Atlas database (`Truzone`) and sends 6-digit verification codes via Gmail.

---

## 🚀 Endpoints

### 1. Signup
**POST** `/api/auth/signup`

Request body:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "john_doe",
  "email": "john@gmail.com",
  "password": "mypassword",
  "device_name": "iPhone 14 Pro",
  "ip_address": "192.168.1.20"
}
```

Response:
```json
{
  "message": "Signup successful. Please check your email for the verification code.",
  "custom_id": "TRU000001"
}
```

---

### 2. Verify Email
**POST** `/api/auth/verify`

Request body:
```json
{
  "email": "john@gmail.com",
  "code": "123456"
}
```

Response:
```json
{
  "message": "Account verified successfully."
}
```

---

### 3. Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john@gmail.com",
  "password": "mypassword"
}
```

Response:
```json
{
  "message": "Login successful.",
  "token": "<JWT_TOKEN>",
  "custom_id": "TRU000001"
}
```

---

## 🛠 Deployment (Render)
1. Push these files to a GitHub repo.
2. Create a **Web Service** on [Render](https://render.com).
3. Choose **Node.js**, set build command:
   ```
   npm install
   ```
   Start command:
   ```
   node server.js
   ```
4. Done ✅ Your API will be live.

---

📌 Notes:
- Database: `Truzone`
- Collection: `users`
- Default profile picture: `https://cdn.truzone.com/default.png`
- Gmail sender: `truzoneverifica564@gmail.com`
