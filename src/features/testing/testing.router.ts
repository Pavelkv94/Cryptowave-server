import { Router } from "express";
import { db } from "../../db/db";
import { HTTP_STATUSES } from "../../common/types/types";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) => {
  db.drop();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
