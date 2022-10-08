import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Job {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({name: "created_at"})
	createdAt: Date;

	@Column({name: "departure_airport"})
	departureAirport: string;

	@Column({name: "arrival_airport"})
	arrivalAirport: string;

	@Column({name: "departure_date"})
	departureDate: string;

	@Column({name: "return_date"})
	returnDate: string;

	@Column({name: "arrival_date"})
	arrivalDate: string;

	@Column({name: "times_to_execute"})
	timesToRun: number;

	@Column({name: "times_executed"})
	timesExecuted: number;
}
