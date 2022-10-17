import express, {NextFunction, Request, Response} from "express";
import {AirlineTicketsService} from "../../src/services/AirlineTicketsService";

const router = express.Router();

const airlineService = new AirlineTicketsService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const airlines = await airlineService.findAll();

	res.json(airlines);
});

router.get("/date", async (req: Request, res: Response, next: NextFunction) => {
	const airlines = await airlineService.findBetweenDate("2022-10-15T19:09:12.000Z", "2022-10-15T18:09:12.000Z");
	res.json(airlines);
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
	await airlineService.deleteAirlineTickets(req.params.id);
	res.status(204).json({});
});

export default router;
