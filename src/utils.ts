const incrementOrDecrementDate = (date: string, day: number) => {
	const currentDate = new Date(date);

	switch (day) {
		case 1:
			currentDate.setDate(currentDate.getDate() + 1);
			break;
		case -1:
			currentDate.setDate(currentDate.getDate() - 1);
			break;
		default:
			break;
	}

	const arrDates = currentDate.toLocaleDateString().split("/").reverse();

	const year = Number(arrDates[0]);
	const month = Number(arrDates[2]) < 10 ? `0${arrDates[2]}` : arrDates[2];
	const dayDate = Number(arrDates[1]) < 10 ? `0${arrDates[1]}` : arrDates[1];

	return `${year}-${month}-${dayDate}`;
};

export const getAlternativesDate = (initialDate: string, finalDate: string): string[][] => {
	const alternativeDates: Set<string[]> = new Set();

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const dates = [incrementOrDecrementDate(initialDate, i - 1), incrementOrDecrementDate(finalDate, j - 1)];

			alternativeDates.add(dates);
		}
	}

	const convertToArr: string[][] = Array.from(alternativeDates);

	return convertToArr;
};
