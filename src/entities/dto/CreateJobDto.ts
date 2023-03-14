import {EnumJobAlternativesDate} from "src/services/enumJobAlternativesDate";

export class CreateJobDto {
	createdAt: Date;

	departureAirport: string;

	arrivalAirport: string;

	departureDate: string;

	arrivalDate: string;

	alternativeDateType: EnumJobAlternativesDate;

	timesToRun: number;

	timesExecuted: number;
}
