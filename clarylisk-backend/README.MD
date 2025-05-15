# Backend-ClaryLisk

# ER Diagram
ER diagram for backend:  
[ERD klik](https://drive.google.com/file/d/1KurwPZ5nijn0efekE1CY-hqMWTnSp8Ge/view?usp=sharing)

# How to run
```
npm run server or npm run dev

```

# Endpoint

## Swagger

### get https://backend-clarylisk.vercel.app/api-docs-clarylisk/swagger.json
- Description: Swagger API Documentation

## AI 

### post https://backend-clarylisk.vercel.app/ai/ai-clarylisk
request headers: Bearer token
request body:
```json
{
     "text":"gw jp 100j"
}
```
response status 200:
```json
{
    "text": "jp",
    "predicted_label": 1,
    "judol":"yes"
}
```
response status 404:
```json
{
    "error": "InvalidUser input"
}
```
response status 500:
```json
{
    "error": "Internal Server Error"
}
```

## user

### post https://backend-clarylisk.vercel.app/user/register
request body:
```json
{
    "username": "clarylisk",
    "password": "clarylis",
    "walletAddress":"oxjdoajdojajsf",
    "role":"creator",
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
    "facebook":"optional",
    "instagram":"optional",
    "twitter":"optional",
    "youtube":"optional",
    "description":"blablaba"
}
```
response status 200:
```json
{
    "message":"success registered",
    "walletAddress":"kasdfjkafjdaaf"
}
```
response status 404:
```json
{
    "error": "Invalid data"
}
```
response status 500:
```json
{
    "error": "Internal Server Error"
}
```

### post https://backend-clarylisk.vercel.app/user/login
request body:
```json
{
    "walletAddress":"oxjdoajdojajsf",
    "password":"clarylis"
}
```
response status 200:
```json
set cookie token and redirect url
```
response status 500:
```json
{
    "error": "Internal Server Error"
}
```

### get https://backend-clarylisk.vercel.app/user/profile
response status 200:
```json
{
  "username": "john_doe",
  "role": "creator",
  "description": "A passionate developer",
  "wallet": [
    {
      "walletAdress": "0x123abc456def"
    }
  ],
  "medsos": [
    {
      "facebook": "https://facebook.com/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "instagram": "https://instagram.com/johndoe",
      "youtube": "https://youtube.com/johndoe"
    }
  ],
  "image": [
    {
      "image": "https://example.com/avatar.png"
    }
  ]
}
```

### PATCH https://backend-clarylisk.vercel.app/user/profile
req header: Bearer token 

req:
```json
{
  "password": "string",
  "walletAddress": "string",
  "facebook": "string",
  "twitter": "string",
  "instagram": "string",
  "youtube": "string",
  "image": "string",
  "description": "string",
  "role": "string"
}
```

responde:
```json
{
  "message": "success update profile",
  "data": {
    "idUser": "string",
    "username": "string",
    "role": "string",
    "description": "string",
    "wallet": {
      "walletAdress": "string"
    },
    "medsos": {
      "facebook": "string",
      "twitter": "string",
      "instagram": "string",
      "youtube": "string"
    },
    "image": {
      "image": "string"
    }
  }
}

```
### Logout
curl -X POST https://backend-clarylisk.vercel.app/user/logout \
  -H "Authorization: Bearer your_token_here" \
  --cookie "access_token=your_token_here"

### all creator
GET https://backend-clarylisk.vercel.app/creators

### list creator by id 
GET https://backend-clarylisk.vercel.app/creators/:userId


### validation for rating
if the creator take a donation that indicated judol so they rating will be minus 1

## IF YOU WANT TO TEST API, YOU CAN GET /api-docs-clarylisk/#/User
