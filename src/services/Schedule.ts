import nodeCron from "node-cron";
import {JobService} from "./JobsService";
import {EnumSchedulePattern} from "./enumSchedulePattern";
import {LogService} from "./logService";

export class Schedule {
	private schedulePattern: EnumSchedulePattern;
	private scheduleServiceDelete: EnumSchedulePattern;
	jobService: JobService;
	logService: LogService;
	private alreadyRunning: boolean = false;

	constructor() {
		this.getHoursFromServerAndCompare();
		this.jobService = new JobService();
		this.logService = new LogService();
		this.scheduleServiceDelete = EnumSchedulePattern.EVERY_12_HOURS;
	}

	async execute() {
		const job = nodeCron.schedule(this.schedulePattern, async () => {
			const jobs = await this.jobService.getAllJobsCanExecute();

			this.alreadyRunning = true;
			this.getHoursFromServerAndCompare();

			if (jobs.length === 0) {
				console.log("No jobs to execute");
			}

			await this.jobService.executeCrawler(jobs);
			this.alreadyRunning = false;
		});

		return job;
	}

	setSchedulePattern(schedulePattern: EnumSchedulePattern) {
		this.schedulePattern = schedulePattern;
	}

	setSchedulePatternDelete(schedulePattern: EnumSchedulePattern) {
		this.scheduleServiceDelete = schedulePattern;
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
		const job = nodeCron.schedule(this.scheduleServiceDelete, async () => {
			const canBeExecuted = this.alreadyRunning;

			if (canBeExecuted) {
				this.setSchedulePatternDelete(EnumSchedulePattern.EVERY_12_HOURS);

				await this.logService.saveLogs();
			} else {
				this.setSchedulePatternDelete(EnumSchedulePattern.EVERY_5_MINUTES);
			}
		});

		return job;
	}
}
