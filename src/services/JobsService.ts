import {checkValidDates} from "../../src/utils";
import AppDataSource from "../../src/database";
import {CreateJobDto} from "../../src/entities/dto/CreateJobDto";
import {Job} from "../../src/entities/Jobs";

export class JobService {
	private jobRepository = AppDataSource.getRepository(Job);

	constructor() {}

	async createJob(createJobDto: CreateJobDto) {
		try {
			const validationDate = checkValidDates(createJobDto.departureDate, createJobDto.arrivalDate);

			if (validationDate) {
				createJobDto.timesExecuted = 0;
				createJobDto.createdAt = new Date();

				const job = this.jobRepository.create(createJobDto);
				await this.jobRepository.save(job);
				return job;
			}

			throw new Error("Invalid dates");
		} catch (err) {
			console.error(err);
		}
	}

	async getAllJobsCanExecute() {
		try {
			const jobs = await this.jobRepository.find({
				take: 10,
			});

			const jobsCanExecute = jobs.filter(job => {
				const maxTimesToRun = job.timesToRun;
				const timesExecuted = job.timesExecuted;

				if (timesExecuted < maxTimesToRun) {
					return job;
				}
			});

			return jobsCanExecute;
		} catch (err) {
			console.error(err);
		}
	}

	async getAllJobs() {
		try {
			return await this.jobRepository.find();
		} catch (err) {
			console.error(err);
		}
	}

	async getJobById(id: string) {
		try {
			return await this.jobRepository.findOneBy({id});
		} catch (err) {
			console.error(err);
		}
	}

	async deleteJobById(id: string) {
		try {
			await this.jobRepository.delete({id});
		} catch (err) {
			console.error(err);
		}
	}

	async updateJobById(id: string, createJobDto: CreateJobDto) {
		try {
			await this.jobRepository.update({id}, createJobDto);
		} catch (err) {
			console.error(err);
		}
	}

	async incrementTimesExecuted(id: string) {
		try {
			const job = await this.jobRepository.findOneBy({id});

			const maxTimesToRun = job.timesToRun;
			const timesExecuted = job.timesExecuted;

			if (timesExecuted < maxTimesToRun) {
				job.timesExecuted++;
				await this.jobRepository.save(job);
				return;
			}
		} catch (err) {
			console.error(err);
		}
	}
}