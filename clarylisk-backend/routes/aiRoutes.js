import express from 'express';
import { validateToken } from '../middleware/middleware.js';
const aiRoutes = express.Router();
import { aiPredict } from '../controller/aiController.js';


/**
 * @swagger
 * /ai/ai-clarylisk:
 *   post:
 *     summary: AI Prediction API
 *     description: Takes a text input and returns a predicted label.
 *     tags:
 *       - AI
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "gw jp 100j"
 *     responses:
 *       200:
 *         description: Successful prediction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   example: "jp"
 *                 predicted_label:
 *                   type: integer
 *                   example: 1
 *                 judol:
 *                   type: string
 *                   example: "yes"
 *       404:
 *         description: Invalid user input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "InvalidUser input"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

aiRoutes.post('/ai-clarylisk', aiPredict)

export default aiRoutes