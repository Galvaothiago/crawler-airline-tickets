import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ArrivalFlights} from "../ArrivalFlights";
import {DepartureFlights} from "../DepartureFlights";

export class CreateAirlineTicketsDto {
	departureDate: string;
	arrivalDate: string;
	company: string;
	departureFlights!: DepartureFlights[];
	arrivalFlights!: ArrivalFlights[];
	priceTax: string;
	priceWithoutTax: string;
	priceTotal: string;
	verifiedAt: Date;
}
