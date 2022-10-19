import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
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

	@OneToMany(() => DepartureFlight, departureFlights => departureFlights.airlineTicket, {cascade: true})
	departureFlights?: Relation<DepartureFlight>[];

	@OneToMany(() => ArrivalFlight, arrivalFlights => arrivalFlights.airlineTicket, {cascade: true})
	arrivalFlights?: Relation<ArrivalFlight>[];

	@Column({type: "float", name: "price_without_tax"})
	priceWithoutTax: number;

	@Column({type: "float", name: "price_tax"})
	priceTax: number;

	@Column({type: "float", name: "price_total"})
	priceTotal: number;

	@Column({name: "created_at"})
	createdAt: Date;
}
