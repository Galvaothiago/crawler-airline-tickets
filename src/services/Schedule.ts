import nodeCron from "node-cron";
import {CreateAirlineTicketsDto} from "../../src/entities/dto/CreateAirlineTicketsDto";
import {getAlternativesDate} from "../../src/utils";
import {Crawler} from "./Crawler";
import {JobService} from "./JobsService";
import {v4 as uuid} from "uuid";
import {AirlineTicketsService} from "./AirlineTicketsService";
import {ArrivalFlight} from "../../src/entities/ArrivalFlight";
import {performance} from "perf_hooks";

export class Schedule {
	schedulePattern: string;
	jobService: JobService;
	airlineService: AirlineTicketsService;

	constructor() {
		this.schedulePattern = "*/1 * * * *";
		this.jobService = new JobService();
		this.airlineService = new AirlineTicketsService();
	}

	async execute() {
		const job = nodeCron.schedule(this.schedulePattern, async () => {
			const jobs = await this.jobService.getAllJobs();

			for (let k = 0; k < jobs.length; k++) {
				console.log("Job started: ", jobs[k].id);
				const startTime = performance.now();

				const puppeteer = new Crawler();
				await puppeteer.init();

				const {id, departureDate, arrivalDate, departureAirport, arrivalAirport, timesExecuted} = jobs[k];

				const alternativesDates: string[][] = getAlternativesDate(String(departureDate), String(arrivalDate));

				for (let i = 0; i < alternativesDates.length; i++) {
					const [initialDate, finalDate] = alternativesDates[i];
					try {
						const data = await puppeteer.searchFlight(departureAirport, arrivalAirport, initialDate, finalDate);

						for (const item of data) {
							const airline: CreateAirlineTicketsDto = new CreateAirlineTicketsDto();

							airline.id = uuid();

							airline.company = item.company;
							airline.arrivalDate = item.arrivalDate;
							airline.departureDate = item.departureDate;
							airline.priceTax = item.priceTax;
							airline.priceWithoutTax = item.priceWithoutTax;
							airline.priceTotal = item.priceTotal;

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

						await puppeteer.close();
					} catch (err) {
						console.log(err);
					}
				}
				await puppeteer.close();
				await this.jobService.incrementTimesExecuted(id);

				const endTime = performance.now();
				console.log(`finalized in ${(endTime - startTime) / 1000} seconds`, id);
			}
		});

		return job;
	}
}
