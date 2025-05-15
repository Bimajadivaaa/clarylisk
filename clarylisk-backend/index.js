import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";
import creatorRoutes from "./routes/creatorRoutes.js";

const app = express();

// 1. Basic middleware
app.use(express.json());
app.use(cookieParser());

// 2. Debugging middleware
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// // 3. CORS configuration
// const allowedOrigins = process.env.ALLOWED_CORS?.split(",") || ["http://localhost:3000"];
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests without origin (e.g., Swagger or curl)
//     if (!origin || allowedOrigins.includes(origin)) {
//       console.log("CORS Allowed:", origin || "No Origin");
//       callback(null, true);
//     } else {
//       console.error("Blocked by CORS:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// };

// Handle OPTIONS preflight requests
// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

///////////////////////////////////////////////////////////////////
app.use(cors({ credentials: true, origin: "*" })) // coba klo ini banh
//////////////////////////////////////////////////////////////////

// 4. Static files and Swagger setup
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);
const __swaggerDistPath = path.join(
  _dirname,
  "node_modules",
  "swagger-ui-dist"
);
app.use("/api-docs-clarylisk", express.static(__swaggerDistPath));

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Clarylisk API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: process.env.BASE_URL_APP || "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// 5. CORS debugging endpoint
app.get('/debug-cors', (req, res) => {
  try {
    const allowedCorsEnv = process.env.ALLOWED_CORS || '';
    const allowedOrigins = allowedCorsEnv ? allowedCorsEnv.split(",") : [];

    res.json({
      requestOrigin: req.headers.origin || 'No origin',
      allowedOrigins: allowedOrigins,
      nodeEnv: process.env.NODE_ENV || 'Not defined',
      allowedCorsEnv: allowedCorsEnv || 'Not defined'
    });
  } catch (error) {
    console.error("Error in debug-cors endpoint:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 6. API routes
app.use("/api-docs-clarylisk", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/user", userRoutes);
app.use("/ai", aiRoutes);
app.use("/creators", creatorRoutes);

// 7. Error handling middleware - ALWAYS LAST
app.use(errorMiddleware);


app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${ process.env.PORT }!`);
});