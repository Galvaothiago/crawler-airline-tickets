import express, {NextFunction, Request, Response} from "express";
import {getIATACodeAirport} from "src/services/enumIATA-Code";
import {CreateJobDto} from "../../src/entities/dto/CreateJobDto";
import {JobService} from "../../src/services/JobsService";

const router = express.Router();

const jobService = new JobService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const jobs = await jobService.getAllJobs();

	res.json(jobs);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
	const job: CreateJobDto = req.body;

	job.departureAirport = getIATACodeAirport(job.departureAirport);
	job.arrivalAirport = getIATACodeAirport(job.arrivalAirport);

	await jobService.createJob(job);

	res.json(job);
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
	await jobService.deleteJobById(req.params.id);

	res.status(204).json({});
});

export default router;
