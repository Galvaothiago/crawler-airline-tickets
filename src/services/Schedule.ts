import nodeCron from "node-cron";
import {JobService} from "./JobsService";
import {EnumSchedulePattern} from "./enumSchedulePattern";
import {LogService} from "./logService";

export class Schedule {
	schedulePattern: string;
	jobService: JobService;
	logService: LogService;

	constructor() {
		this.getHoursFromServerAndCompare();
		this.jobService = new JobService();
		this.logService = new LogService();
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

		if (currentHour >= midnightHour && currentHour <= morningHour) {
			this.setSchedulePattern(EnumSchedulePattern.EVERY_30_MINUTES);
			return;
		}

		this.setSchedulePattern(EnumSchedulePattern.EVERY_HOUR);
	}

	async scheduleLogs() {
		const job = nodeCron.schedule(EnumSchedulePattern.EVERY_12_HOURS, async () => {
			await this.logService.saveLogs();
		});

		return job;
	}
}
