import express, {NextFunction, Request, Response} from "express";
import {AirlineTicketsService} from "../../src/services/AirlineTicketsService";

const router = express.Router();

const airlineService = new AirlineTicketsService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const pagination = Number(req.params.pagination ?? 20);
	const takePage = Number(req.params.takePage ?? 0);

	const airlineTickets = await airlineService.findAll(pagination, takePage);

	res.json(airlineTickets);
});

router.get("/:date/:hours", async (req: Request, res: Response, next: NextFunction) => {
	let date = req.params.date;
	const hours = req.params.hours;
	const jobId = req.query?.jobId as string;

	console.log({date, hours, jobId});

	let paramsDate = {
		initial: "",
		final: "",
	};

	if (!date || !hours) {
		res.status(400).json({message: "Invalid parameters"});
	}

	const arrDates = date.split("-");
	date = `${arrDates[2]}-${arrDates[0].padStart(2, "0")}-${arrDates[1].padStart(2, "0")}`;

	if (hours === "full") {
		paramsDate = {
			initial: `${date} 00:00:00`,
			final: `${date} 23:59:59`,
		};
	} else {
		const newHour = hours?.split("-");

		paramsDate = {
			initial: `${date} ${newHour[1]}:00:00`,
			final: `${date} ${newHour[0]}:59:59`,
		};
	}

	const airlines = await airlineService.findBetweenDate(paramsDate.initial, paramsDate.final, jobId);
	res.json(airlines);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;

	if (!id) {
		res.status(400).json({message: "Invalid parameters"});
	}

	const airline = await airlineService.findById(id);
	res.json(airline);
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
	await airlineService.deleteAirlineTickets(req.params.id);
	res.status(200).json({});
});

export default router;
