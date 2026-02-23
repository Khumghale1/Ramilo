import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL ,
    credentials: true, // required for Better Auth session cookies
  })
);
app.use(cookieParser());

// ─── Better Auth ─────────────────────────────────────────────────────────────
// Must be mounted BEFORE express.json() to avoid body parsing conflicts
app.all("/api/auth/*splat", toNodeHandler(auth));

// ─── Body Parsers (after Better Auth) ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Ramailo API is running", status: "ok" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
