export class CreateJobDto {
	createdAt: Date;

	departureAirport: string;

	arrivalAirport: string;

	departureDate: string;

	arrivalDate: string;

	timesToRun: number;

	timesExecuted: number;
}
