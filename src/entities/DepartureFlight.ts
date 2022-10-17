import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import {AirlineTicket} from "./AirlineTickets";

@Entity("departure_flights")
export class DepartureFlight {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => AirlineTicket, airlineTicket => airlineTicket.departureFlights)
	@JoinColumn({name: "airline_ticket_id"})
	airlineTicket: Relation<AirlineTicket>;

	@Column()
	airport: string;

	@Column()
	duration: string;

	@Column()
	connection: string;

	@Column({name: "time_departure"})
	timeDeparture: string;

	@Column({name: "time_arrival"})
	timeArrival: string;
}
