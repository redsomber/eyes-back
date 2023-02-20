import { Router } from "express";
import { createAlertCheck } from "../controllers/createAlerts.js";
import {
  create,
  createAlert,
  getAll,
  getOne,
  remove,
  update,
} from "../controllers/crudController.js";

const router = Router();



router.get("/tickers", getAll);
router.get("/tickers/:id", getOne);
router.get("/alerts", getAll);
router.post("/tickers", create);
router.post("/alerts", createAlert);
router.delete("/tickers/:id", remove);
router.patch("/tickers/:id", createAlertCheck(), update);

export default router;
