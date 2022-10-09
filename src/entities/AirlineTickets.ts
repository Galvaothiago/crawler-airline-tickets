import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ArrivalFlights} from "./ArrivalFlights";
import {DepartureFlights} from "./DepartureFlights";

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

	@ManyToMany(() => DepartureFlights, {cascade: true})
	@JoinTable()
	departureFlight: DepartureFlights[];

	@ManyToMany(() => ArrivalFlights, {cascade: true})
	@JoinTable()
	arrivalFlight: ArrivalFlights[];

	@Column({name: "price_without_tax"})
	priceWithoutTax: string;

	@Column({name: "price_tax"})
	priceTax: string;

	@Column({name: "price_total"})
	priceTotal: string;

	@Column({name: "created_at"})
	createdAt: Date;
}
