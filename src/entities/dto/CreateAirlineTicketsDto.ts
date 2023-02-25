import {AirlineTicket} from "../AirlineTickets";
import {ArrivalFlight} from "../ArrivalFlight";
import {DepartureFlight} from "../DepartureFlight";

export class CreateAirlineTicketsDto {
	id: string;
	jobId: string;
	departureDate: string;
	arrivalDate: string;
	company: string;
	departureFlights?: DepartureFlight[];
	arrivalFlights?: ArrivalFlight[];
	priceTax: number;
	priceWithoutTax: number;
	priceTotal: number;
	createdAt: Date;
}
