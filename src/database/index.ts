import {DataSource} from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
	type: process.env.DB_TYPE as any,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: ["./src/entities/*.ts"],
	synchronize: true,
});

AppDataSource.initialize()
	.then(() => console.log("Data Source has been initialized!"))
	.catch(err => console.error("Error during Data Source initialization", err));

export default AppDataSource;
