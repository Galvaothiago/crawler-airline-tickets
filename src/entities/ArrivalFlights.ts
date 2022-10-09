import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {AirlineTicket} from "./AirlineTickets";

@Entity("arrival_flights")
export class ArrivalFlights {
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
