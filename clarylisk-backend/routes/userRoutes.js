import express from "express";
import * as controller from "../controller/userController.js";
import { validateToken } from "../middleware/middleware.js";
const userRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User authentication and management
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with validation.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *               - walletAddress
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 4
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 maxLength: 8
 *                 example: "12345678"
 *               description:
 *                 type: string
 *                 example: "A passionate developer"
 *               role:
 *                 type: string
 *                 example: "creator"
 *               walletAddress:
 *                 type: string
 *                 example: "0x123abc456def"
 *               image:
 *                 type: string
 *                 example: "https://example.com/avatar.png"
 *               facebook:
 *                 type: string
 *                 example: "https://facebook.com/johndoe"
 *               instagram:
 *                 type: string
 *                 example: "https://instagram.com/johndoe"
 *               twitter:
 *                 type: string
 *                 example: "https://twitter.com/johndoe"
 *               youtube:
 *                 type: string
 *                 example: "https://youtube.com/johndoe"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f7c9a1b2d4c5e6f7a8b9c0"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *       400:
 *         description: Invalid request payload
 *       500:
 *         description: Internal server error
 */

userRoutes.post("/register", controller.registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a token in a cookie upon successful login.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - password
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 example: "0x123abc456def"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login successful, returns an authentication cookie
 *         headers:
 *           Set-Cookie:
 *             description: JWT token set as an HTTP-only cookie
 *             schema:
 *               type: string
 *               example: "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       404:
 *         description: Request was successful, but not yet deployed. You can test it using Postman.
 *       400:
 *         description: Invalid login credentials
 *       500:
 *         description: Internal server error
 */

userRoutes.post("/login", controller.loginUser);

/**
 * @swagger
 * /user/tesMiddleware:
 *   get:
 *     summary: Test middleware authentication
 *     description: Checks if the request has successfully passed through the authentication middleware.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully authenticated, user data is available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "success"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "null auth"
 *       500:
 *         description: Internal server error
 */
userRoutes.get("/tesMiddleware", validateToken, controller.validateMidTest);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 role:
 *                   type: string
 *                   example: "creator"
 *                 description:
 *                   type: string
 *                   example: "A passionate developer"
 *                 wallet:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       walletAdress:
 *                         type: string
 *                         example: "0x123abc456def"
 *                 medsos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       facebook:
 *                         type: string
 *                         example: "https://facebook.com/johndoe"
 *                       twitter:
 *                         type: string
 *                         example: "https://twitter.com/johndoe"
 *                       instagram:
 *                         type: string
 *                         example: "https://instagram.com/johndoe"
 *                       youtube:
 *                         type: string
 *                         example: "https://youtube.com/johndoe"
 *                 image:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       image:
 *                         type: string
 *                         format: uri
 *                         example: "https://example.com/avatar.png"
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "null auth"
 *       500:
 *         description: Internal server error
 */

userRoutes.get("/profile", validateToken, controller.profile);
userRoutes.patch("/profile", validateToken, controller.editProfile);

userRoutes.post("/logout", validateToken, controller.logout);
userRoutes.get("/cek-data", validateToken, controller.cekData);

export default userRoutes;
