import nodeCron from "node-cron";
import {JobService} from "./JobsService";
import {EnumSchedulePattern} from "./enumSchedulePattern";
import {LogService} from "./logService";

export class Schedule {
	private schedulePattern: EnumSchedulePattern;
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
			await this.logService.saveLogs();
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
			this.setSchedulePattern(EnumSchedulePattern.EVERY_15_MINUTES);
			return;
		}

		this.setSchedulePattern(EnumSchedulePattern.EVERY_15_MINUTES);
	}
}
