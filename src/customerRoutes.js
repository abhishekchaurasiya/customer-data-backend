import express from "express";
import getCustomers from "./customerController.js";
import { validateQueryParams } from "./utils/validateUtility.js";

const customerRouter = express.Router();

customerRouter.get("/customers", validateQueryParams, getCustomers);

export default customerRouter;
