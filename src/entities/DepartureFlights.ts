import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {AirlineTicket} from "./AirlineTickets";

@Entity("departure_flights")
export class DepartureFlights {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	airport: string;

	@Column()
	duration: string;

	@Column()
	connection: string;

	@Column({name: "time_departure"})
	time_departure: string;

	@Column({name: "time_arrival"})
	time_arrival: string;
}
