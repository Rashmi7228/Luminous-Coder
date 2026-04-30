import { Router, type IRouter } from "express";
import healthRouter from "./health";
import symptomCheckRouter from "./symptom-check";

const router: IRouter = Router();

router.use(healthRouter);
router.use(symptomCheckRouter);

export default router;
