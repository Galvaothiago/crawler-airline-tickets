import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("arrival_flights")
export class ArrivalFlight {
	@PrimaryGeneratedColumn("uuid")
	id: string;

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
