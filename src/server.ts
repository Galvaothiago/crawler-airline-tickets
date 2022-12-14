import dotenv from "dotenv";
import express, {Express} from "express";
import AppDataSource from "./database";

import {Schedule} from "./services/Schedule";

import RouterJobs from "./controllers/jobController";
import RouterAirlineTickets from "./controllers/airlineTicketsController";
import RouterLogs from "./controllers/logController";

const app: Express = express();
dotenv.config();

const port = process.env.PORT ?? 3333;

app.use(express.json());

app.use("/jobs", RouterJobs);
app.use("/airline-tickets", RouterAirlineTickets);
app.use("/logs", RouterLogs);

const job = new Schedule();
const jobSchedule = await job.execute();
const logSchedule = await job.scheduleLogs();

app.listen(port, async () => {
	jobSchedule.start();
	logSchedule.start();
	await AppDataSource.initialize();

	console.log(`Server is running on port ${port}`);
});
