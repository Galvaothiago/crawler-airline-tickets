import {DataSource} from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: "root",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: ["./src/entities/*.ts"],
	synchronize: true,
});
