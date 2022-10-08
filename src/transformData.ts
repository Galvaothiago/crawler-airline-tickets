let flightDates: string[] = [];
let departure: string[] = [];
let arrival: string[] = [];
let prices = new Set();

let lastOption = "";

const cleanVariables = () => {
	flightDates = [];
	departure = [];
	arrival = [];
	prices = new Set();
};

const createFlightObj = (data: string[]) => {
	let result = [];

	for (let i = 0; i < data.length / 7; i++) {
		result.push({
			company: data[i * 7],
			airport: data[i * 7 + 1],
			time_departure: data[i * 7 + 2],
			duration: data[i * 7 + 3],
			connection: data[i * 7 + 4],
			time_arrival: data[i * 7 + 6],
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

export const transformData = (obj: string[]) => {
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
		ida: initialDate,
		schedules_ida: newDepartures,
		volta: finalDate,
		schedules_volta: newArrivals,
		price__without_tax: newPrices[1],
		price_tax: newPrices[2],
		price_total: newPrices[newPrices.length - 1],
	};

	cleanVariables();

	return dataFormated;
};
