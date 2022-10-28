import {checkValidDates, getAlternativesDate} from "../utils/dates-utils";
import AppDataSource from "../../src/database";
import {CreateJobDto} from "../../src/entities/dto/CreateJobDto";
import {Job} from "../../src/entities/Jobs";
import {AirlineTicketsService} from "./AirlineTicketsService";
import {ArrivalFlight} from "../../src/entities/ArrivalFlight";
import {CreateAirlineTicketsDto} from "../../src/entities/dto/CreateAirlineTicketsDto";

import {Crawler, InformationFlight} from "./Crawler";
import {v4 as uuid} from "uuid";
import {AirlineTicketProps, transformData} from "../utils/transformData";

export class JobService {
	private jobRepository = AppDataSource.getRepository(Job);
	private airlineService = new AirlineTicketsService();
	puppeteer: Crawler;

	constructor() {
		this.puppeteer = new Crawler();
	}

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
			let cluster = await this.puppeteer.initPuppeteerCluster();

			console.log("Job started: ", jobs[k].id);

			const {id, departureDate, arrivalDate, departureAirport, arrivalAirport} = jobs[k];

			const alternativesDates: string[][] = getAlternativesDate(String(departureDate), String(arrivalDate));

			console.time("Job time");

			await cluster.task(async ({page, data: info}) => {
				const func = async (info: InformationFlight) => {
					try {
						const url = `${process.env.URL_TO_CRAWLER}${info.departure}/${info.arrival}/${info.initialDate}/${info.finalDate}/1/0/0/EC`;

						await page.goto(url, {waitUntil: "networkidle2"});

						const data = await page.evaluate(async () => {
							let result = [];
							let scrollValue = 0;

							const elementQuantiAirTickets: HTMLElement | null = document.querySelector(".css-7zc1qr");
							const airlineTicketsFound = Number(elementQuantiAirTickets?.innerText.split(" ")[0]);

							function scrollPage(value: number) {
								window.scrollTo(0, value);
							}

							function delay(time: number) {
								return new Promise(function (resolve) {
									setTimeout(resolve, time);
								});
							}

							await delay(2000);

							for (let i = 0; i < 50; i++) {
								if (result.length >= Number(airlineTicketsFound) || scrollValue > 10000) {
									return result;
								}

								let container: HTMLElement | null = document.querySelector(`[data-index="${i}"]`);

								if (container) {
									result.push(container.innerText);
									container = null;
									await delay(300);
								} else {
									scrollPage((scrollValue += 700));
									await delay(600);

									container = document.querySelector(`[data-index="${i}"]`);

									if (container) {
										result.push(container.innerText);
										container = null;
										await delay(300);
									}
								}
							}
						});

						const formatContent = (content: string) => {
							if (!content) return [];
							const arr = content?.split("Detalhes").join("").split("\n");

							return arr;
						};

						if (!data) {
							return [];
						}

						const result: AirlineTicketProps[] = data.map((item: string) => {
							const content = formatContent(item);

							return transformData(content);
						});

						return result;
					} catch (err) {
						console.log(err);
					}
				};

				const result = await func(info);

				const airlineList: CreateAirlineTicketsDto[] = []

				for (const item of result) {
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

					airlineList.push(airline);
				}
				await this.airlineService.createAirlineTicket(airlineList);
			});

			for (let i = 0; i < alternativesDates.length; i++) {
				const [initialDate, finalDate] = alternativesDates[i];

				const information: InformationFlight = {
					departure: departureAirport,
					arrival: arrivalAirport,
					initialDate,
					finalDate,
				};

				await cluster.queue(information);
			}

			await cluster.idle();
			await cluster.close();

			cluster = null;
			await this.incrementTimesExecuted(id);
			console.timeEnd("Job time");
		}
	}
}
