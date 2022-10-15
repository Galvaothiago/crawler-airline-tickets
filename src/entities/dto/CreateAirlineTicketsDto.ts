import {ArrivalFlight} from "../ArrivalFlight";
import {DepartureFlight} from "../DepartureFlight";

export class CreateAirlineTicketsDto {
	departureDate: string;
	arrivalDate: string;
	company: string;
	departureFlights: DepartureFlight[];
	arrivalFlights: ArrivalFlight[];
	priceTax: string;
	priceWithoutTax: string;
	priceTotal: string;
	verifiedAt: Date;
}
