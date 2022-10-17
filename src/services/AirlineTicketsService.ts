import {CreateAirlineTicketsDto} from "../../src/entities/dto/CreateAirlineTicketsDto";
import AppDataSource from "../../src/database";
import {AirlineTicket} from "../../src/entities/AirlineTickets";
import {ArrivalFlight} from "../../src/entities/ArrivalFlight";
import {Between} from "typeorm";

export class AirlineTicketsService {
	private airlineRepository = AppDataSource.getRepository(AirlineTicket);

	constructor() {}

	async createAirlineTicket(airlineTicketDto: CreateAirlineTicketsDto) {
		try {
			const airline = this.airlineRepository.create(airlineTicketDto);
			await this.airlineRepository.save(airline);
			return airline;
		} catch (err) {
			console.error(err);
		}
	}

	async findAll() {
		try {
			const airlineTickets = await this.airlineRepository.find({
				relations: {
					arrivalFlights: true,
					departureFlights: true,
				},
			});

			return airlineTickets;
		} catch (err) {
			console.error(err);
		}
	}

	async findBetweenDate(initialDate: string, finalDate: string) {
		try {
			const airlineTickets = await this.airlineRepository
				.createQueryBuilder("airlineTicket")
				.where("airlineTicket.createdAt >= :startDate", {startDate: new Date("2022-10-15T20:00:00.000Z")})
				.andWhere("airlineTicket.createdAt <= :endDate", {endDate: new Date("2022-10-16T00:00:00.000Z")})
				.getMany();

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
