import {CreateAirlineTicketsDto} from "../../src/entities/dto/CreateAirlineTicketsDto";
import AppDataSource from "../../src/database";
import {AirlineTicket} from "../../src/entities/AirlineTickets";

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
			const airlineTickets = await this.airlineRepository.find();

			return airlineTickets;
		} catch (err) {
			console.error(err);
		}
	}
}
