import {checkValidDates, getAlternativesDate} from "../../utils/dates-utils";
import AppDataSource from "../../src/database";
import {CreateJobDto} from "../../src/entities/dto/CreateJobDto";
import {Job} from "../../src/entities/Jobs";
import {AirlineTicketsService} from "./AirlineTicketsService";
import {Crawler} from "./Crawler";
import {CreateAirlineTicketsDto} from "../../src/entities/dto/CreateAirlineTicketsDto";

import {v4 as uuid} from "uuid";
import {ArrivalFlight} from "../../src/entities/ArrivalFlight";

export class JobService {
	private jobRepository = AppDataSource.getRepository(Job);
	private airlineService = new AirlineTicketsService();
	private puppeteer: Crawler;

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

	convertStringMoneyToNumber(money: string) {
		const moneyWithoutDollar = money.replace("R$", "");
		const moneyWithoutComma = moneyWithoutDollar.replace(",", "-");
		const moneyWithoutDot = moneyWithoutComma.replace(".", "");
		const moneyWithoutDash = moneyWithoutDot.replace("-", ".");
		const moneyWithoutSpace = moneyWithoutDash.replace(" ", "");

		return Number(moneyWithoutSpace);
	}

	async executeCrawler(jobs: Job[]) {
		for (let k = 0; k < jobs.length; k++) {
			console.log("Job started: ", jobs[k].id);

			this.puppeteer = new Crawler();
			await this.puppeteer.init();

			const {id, departureDate, arrivalDate, departureAirport, arrivalAirport} = jobs[k];

			const alternativesDates: string[][] = getAlternativesDate(String(departureDate), String(arrivalDate));

			for (let i = 0; i < alternativesDates.length; i++) {
				const [initialDate, finalDate] = alternativesDates[i];
				try {
					const data = await this.puppeteer.searchFlight(departureAirport, arrivalAirport, initialDate, finalDate);

					for (const item of data) {
						const airline: CreateAirlineTicketsDto = new CreateAirlineTicketsDto();

						airline.id = uuid();

						airline.company = item.company;
						airline.arrivalDate = item.arrivalDate;
						airline.departureDate = item.departureDate;
						airline.priceTax = this.convertStringMoneyToNumber(item.priceTax);
						airline.priceWithoutTax = this.convertStringMoneyToNumber(item.priceWithoutTax);
						airline.priceTotal = this.convertStringMoneyToNumber(item.priceTotal);

						airline.createdAt = new Date();

						const newItemArrival = item.arrivalFlights.filter(item => {
							if (item.airport && item.connection) {
								return item;
							}
						});

						airline.arrivalFlights = newItemArrival.map(arrFligth => {
							const arrivalFlight = new ArrivalFlight();

							arrivalFlight.airport = arrFligth.airport;
							arrivalFlight.connection = arrFligth.connection;
							arrivalFlight.duration = arrFligth.duration;
							arrivalFlight.timeArrival = arrFligth.timeArrival;
							arrivalFlight.timeDeparture = arrFligth.timeDeparture;

							return arrivalFlight;
						});

						const newItemDeparture = item.departureFlights.filter(item => {
							if (item.airport && item.connection) {
								return item;
							}
						});

						airline.departureFlights = newItemDeparture.map(depFligth => {
							const departureFlight = new ArrivalFlight();

							departureFlight.airport = depFligth.airport;
							departureFlight.connection = depFligth.connection;
							departureFlight.duration = depFligth.duration;
							departureFlight.timeArrival = depFligth.timeArrival;
							departureFlight.timeDeparture = depFligth.timeDeparture;

							return departureFlight;
						});

						await this.airlineService.createAirlineTicket(airline);
					}
				} catch (err) {
					console.log(err);
				}
			}
			await this.puppeteer.close();
			await this.incrementTimesExecuted(id);
		}
	}
}
