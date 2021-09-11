import expess from "express";

const router = expess.Router();

router.get("/", (req, res) => res.json({ status: "ok" }).status(200));

export default router;
