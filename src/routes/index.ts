import express from "express";
import { router as matchesRouter } from "./matches";

export const generalRouter = express.Router()

generalRouter.use('/', matchesRouter)