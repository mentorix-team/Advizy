import express from "express";
import { testFastApi, recommendExperts } from "../controllers/fastapi.controller.js";

const router = express.Router();

router.get("/ping", testFastApi);
router.post("/search-experts", recommendExperts);

export default router;