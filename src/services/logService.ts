import fs from "fs";
import AppDataSource from "../../src/database";
import {LogDto} from "../../src/entities/dto/logDto";
import {Log} from "../../src/entities/logs";
import {LogTypesEnum} from "./logs-enum";

export class LogService {
	static logsRepository = AppDataSource.getRepository(Log);
	constructor() {}

	static async createLog(type: LogTypesEnum, message: string) {
		const path = process.env.LOGS_PATH;

		const currentDate = new Date().toISOString();
		const log = `${type};${message};${currentDate}\n`;

		fs.appendFileSync(path, log);
	}

	static async saveLogs() {
		const path = process.env.LOGS_PATH;
		const listLogs: LogDto[] = [];

		const fileStream = fs.createReadStream(path);

		const rl = require("readline").createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		for await (const line of rl) {
			const log = this.convertLineLogToObject(line);

			const logsDto = new LogDto();
			logsDto.type = log.type;
			logsDto.message = log.message;
			logsDto.createdAt = new Date(log.createdAt);

			listLogs.push(logsDto);
		}

		await this.insertLogsInDatabase(listLogs);
		await this.deleteLogsAfterInsert();
		listLogs.length = 0;
	}

	static async deleteLogsAfterInsert() {
		const path = process.env.LOGS_PATH;

		try {
			fs.unlinkSync(path);
		} catch (err) {
			console.error(err);
		}
	}

	static convertLineLogToObject(line: string) {
		const [type, message, createdAt] = line.split(";");
		return {
			type,
			message,
			createdAt,
		};
	}

	static async insertLogsInDatabase(listLogs: LogDto[]) {
		try {
			const logs = this.logsRepository.create(listLogs);
			await this.logsRepository.save(logs);
		} catch (err) {
			console.error(err);
		}
	}
}
