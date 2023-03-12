import dotenv from "dotenv";
import express, {Express} from "express";
import AppDataSource from "./database";

import {Schedule} from "./services/Schedule";
import cors from "cors";
import RouterJobs from "./controllers/jobController";
import RouterAirlineTickets from "./controllers/airlineTicketsController";
import RouterLogs from "./controllers/logController";
import RouterVerifyKey from "./controllers/verifyKey.controller";

const app: Express = express();
dotenv.config();

const port = process.env.PORT ?? 3333;

app.use(cors());
app.use(express.json());

app.use("/jobs", RouterJobs);
app.use("/airline-tickets", RouterAirlineTickets);
app.use("/logs", RouterLogs);
app.use("/key", RouterVerifyKey);

const job = new Schedule();
const jobSchedule = await job.execute();

app.listen(port, async () => {
	jobSchedule.start();
	await AppDataSource.initialize();

	console.log(`Server is running on port ${port}`);
});
