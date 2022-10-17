import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import {AirlineTicket} from "./AirlineTickets";

@Entity("arrival_flights")
export class ArrivalFlight {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => AirlineTicket, airlineTicket => airlineTicket.arrivalFlights)
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
