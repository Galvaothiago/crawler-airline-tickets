import nodeCron from "node-cron";
import {JobService} from "./JobsService";

export class Schedule {
	schedulePattern: string;
	jobService: JobService;

	constructor() {
		this.schedulePattern = "* * * * *";
		this.jobService = new JobService();
	}

	async execute() {
		const job = nodeCron.schedule(this.schedulePattern, async () => {
			const jobs = await this.jobService.getAllJobsCanExecute();
			if (jobs.length === 0) {
				console.log("No jobs to execute");
			}

			await this.jobService.executeCrawler(jobs);
		});

		return job;
	}
}
