let flightDates: string[] = [];
let departure: string[] = [];
let arrival: string[] = [];
let prices = new Set();

let lastOption = "";

export interface FlightProps {
	company: string;
	airport: string;
	timeDeparture: string;
	duration: string;
	connection: string;
	timeArrival: string;
}

export interface AirlineTicketProps {
	departureDate: string;
	arrivalDate: string;
	company: string;
	departureFlights: FlightProps[];
	arrivalFlights: FlightProps[];
	priceTax: string;
	priceWithoutTax: string;
	priceTotal: string;
}

const cleanVariables = () => {
	flightDates = [];
	departure = [];
	arrival = [];
	prices = new Set();
};

const createFlightObj = (data: string[]): FlightProps[] => {
	let result = [];

	for (let i = 0; i < data.length / 7; i++) {
		result.push({
			company: data[i * 7],
			airport: data[i * 7 + 1],
			timeDeparture: data[i * 7 + 2],
			duration: data[i * 7 + 3],
			connection: data[i * 7 + 4],
			timeArrival: data[i * 7 + 6],
		});
	}

	return result;
};

const addValueIntoArr = (item: string) => {
	if (item.includes("Ida -") || item.includes("Volta -")) lastOption = item;

	if (item.includes("R$")) {
		lastOption = "";
		prices.add(item);
	}

	if (lastOption.includes("Ida -")) {
		if (item) departure.push(item);
	}

	if (lastOption.includes("Volta -")) {
		if (item) arrival.push(item);
	}
};

export const transformData = (obj: string[]): AirlineTicketProps => {
	const hasData = obj.length > 0;

	if (!hasData) return;

	obj.forEach(item => {
		if (item) {
			addValueIntoArr(item);
		}
	});

	flightDates.push(departure[0]);
	flightDates.push(arrival[0]);

	const initialDate = flightDates[0]?.split("-")[1].trim();
	const finalDate = flightDates[1]?.split("-")[1].trim();

	const newDepartures = createFlightObj(departure.slice(1));
	const newArrivals = createFlightObj(arrival.slice(1, arrival.length - 2));

	const newPrices = Array.from(prices);

	const dataFormated = {
		departureDate: initialDate,
		arrivalDate: finalDate,
		company: newDepartures[0].company,
		departureFlights: newDepartures,
		arrivalFlights: newArrivals,
		priceTax: newPrices[2] as string,
		priceWithoutTax: newPrices[1] as string,
		priceTotal: newPrices[newPrices.length - 1] as string,
	};

	cleanVariables();

	return dataFormated;
};
