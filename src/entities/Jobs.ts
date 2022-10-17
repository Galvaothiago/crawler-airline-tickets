import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Job {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@CreateDateColumn()
	@Column({type: Date, name: "created_at"})
	createdAt: Date;

	@Column({name: "departure_airport"})
	departureAirport: string;

	@Column({name: "arrival_airport"})
	arrivalAirport: string;

	@Column({name: "departure_date"})
	departureDate: string;

	@Column({name: "arrival_date"})
	arrivalDate: string;

	@Column({name: "times_to_execute"})
	timesToRun: number;

	@Column({name: "times_executed", nullable: true})
	timesExecuted: number;
}
