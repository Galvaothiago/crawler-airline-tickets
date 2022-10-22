import nodeCron from "node-cron";
import {JobService} from "./JobsService";
import {EnumSchedulePattern} from "./enumSchedulePattern";

export class Schedule {
	schedulePattern: string;
	jobService: JobService;

	constructor() {
		this.schedulePattern = EnumSchedulePattern.EVERY_15_MINUTES;
		this.jobService = new JobService();
	}

	async execute() {
		const job = nodeCron.schedule(this.schedulePattern, async () => {
			const jobs = await this.jobService.getAllJobsCanExecute();

			this.getHoursFromServerAndCompare();

			if (jobs.length === 0) {
				console.log("No jobs to execute");
			}

			await this.jobService.executeCrawler(jobs);
		});

		return job;
	}

	setSchedulePattern(schedulePattern: EnumSchedulePattern) {
		this.schedulePattern = schedulePattern;
	}

	getHoursFromServerAndCompare() {
		const currentDate = new Date();

		const currentHour = currentDate.getHours();
		const midnightHour = 0;
		const morningHour = 6;

		if (currentHour >= midnightHour && currentHour < morningHour) {
			this.setSchedulePattern(EnumSchedulePattern.EVERY_45_MINUTES);
			return;
		}

		this.setSchedulePattern(EnumSchedulePattern.EVERY_1_MINUTES);
	}
}
