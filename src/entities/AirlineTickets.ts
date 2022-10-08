import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("airline_tickets")
export class AirlineTickets {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({name: "departure_date"})
	departureDate: string;

	@Column({name: "return_date"})
	arrivalDate: string;

	@Column()
	type: string;

	@Column()
	company: string;

	@Column()
	airport: string;

	@Column({name: "time_departure"})
	time_departure: string;

	@Column()
	duration: string;

	@Column()
	connection: string;

	@Column({name: "time_arrival"})
	time_arrival: string;

	@Column({name: "price_without_tax"})
	priceWithoutTax: string;

	@Column({name: "price_tax"})
	priceTax: string;

	@Column({name: "price_total"})
	priceTotal: string;

	@Column({name: "created_at"})
	createdAt: Date;
}
