import express, {NextFunction, Request, Response} from "express";
import {LogService} from "../../src/services/logService";

const router = express.Router();

const logService = new LogService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const pagination = Number(req.params.page) ?? 0;
	const limitPage = Number(req.params.limitPage) ?? 80;

	const logs = await logService.getLogsByPage(pagination, limitPage);

	res.json(logs);
});

router.get("/:type", async (req: Request, res: Response, next: NextFunction) => {
	const type = String(req.params.type);

	const logsByType = await logService.getAllLogsByType(type);

	res.json(logsByType);
});

export default router;
