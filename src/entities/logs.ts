import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("logs")
export class Log {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	type: string;

	@Column()
	message: string;

	@Column({name: "created_at", type: "timestamp"})
	createdAt: Date;
}
