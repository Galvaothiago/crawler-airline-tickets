import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ArrivalFlight} from "./ArrivalFlight";
import {DepartureFlight} from "./DepartureFlight";

@Entity("airline_tickets")
export class AirlineTicket {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({name: "departure_date"})
	departureDate: string;

	@Column({name: "return_date"})
	arrivalDate: string;

	@Column()
	company: string;

	@OneToMany(() => DepartureFlight, departureFlights => departureFlights.id)
	departureFlight: DepartureFlight[];

	@OneToMany(() => ArrivalFlight, arrivalFlights => arrivalFlights.id)
	arrivalFlight: ArrivalFlight[];

	@Column({name: "price_without_tax"})
	priceWithoutTax: string;

	@Column({name: "price_tax"})
	priceTax: string;

	@Column({name: "price_total"})
	priceTotal: string;

	@Column({name: "created_at"})
	createdAt: Date;
}
