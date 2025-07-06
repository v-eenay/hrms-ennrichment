import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).send("Welcome to HRMS API - Human Resource Management System");
});

export default router;