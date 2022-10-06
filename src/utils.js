import moment from "moment";

const incrementOrDecrementDate = (date, day) => {
	if (day === 0) {
		return moment(date).format("YYYY-MM-DD");
	}

	if (day > 0) {
		return moment(date).add(1, "days").format("YYYY-MM-DD");
	}

	return moment(date).subtract(1, "days").format("YYYY-MM-DD");
};

export const getAlternativesDate = (initialDate, finalDate) => {
	const alternativeDates = new Set();

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const dates = [incrementOrDecrementDate(initialDate, i - 1), incrementOrDecrementDate(finalDate, j - 1)];

			alternativeDates.add(dates);
		}
	}

	return Array.from(alternativeDates);
};
