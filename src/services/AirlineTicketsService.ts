import {CreateAirlineTicketsDto} from "../../src/entities/dto/CreateAirlineTicketsDto";
import AppDataSource from "../../src/database";
import {AirlineTicket} from "../../src/entities/AirlineTickets";
import {ArrivalFlight} from "../../src/entities/ArrivalFlight";
import {Between} from "typeorm";

export class AirlineTicketsService {
	private airlineRepository = AppDataSource.getRepository(AirlineTicket);

	constructor() {}

	async createAirlineTicket(airlineTicketDto: CreateAirlineTicketsDto[]) {
		try {
			const airline = this.airlineRepository.create(airlineTicketDto);
			await this.airlineRepository.save(airline);
			return airline;
		} catch (err) {
			console.error(err);
		}
	}

	async findAll(pagination: number, takePage: number) {
		takePage = pagination ?? 0;

		try {
			const airlineTickets = await this.airlineRepository.find({
				skip: takePage,
				take: pagination,
			});

			return airlineTickets;
		} catch (err) {
			console.error(err);
		}
	}

	async findById(id: string) {
		try {
			const airlineTickets = this.airlineRepository.findOne({
				where: {
					id,
				},
				relations: {
					arrivalFlights: true,
					departureFlights: true,
				},
			});

			if (!id) {
				throw new Error("Airline Ticket not found");
			}

			return airlineTickets;
		} catch (err) {
			console.error(err.message);
		}
	}

	async findBetweenDate(initialDate: string, finalDate: string, jobId: string) {
		try {
			const airlineTickets = await this.airlineRepository.find({
				where: {
					jobId: jobId,
					createdAt: Between(new Date(initialDate), new Date(finalDate)),
				},
				order: {
					priceTotal: "ASC",
				},
				take: 20,
			});

			return airlineTickets;
		} catch (err) {
			console.error(err);
		}
	}

	async deleteAirlineTickets(id: string) {
		try {
			await this.airlineRepository.delete({id});
		} catch (err) {
			console.error(err);
		}
	}
}
