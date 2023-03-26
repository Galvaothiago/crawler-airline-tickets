export const generateAlternateDates = (startDate: Date, endDate: Date, daysToAdd: number, datePairs: Set<string[]>) => {
	if (datePairs.size >= 12) {
		return Array.from(datePairs);
	}

	datePairs.add([transformDate(startDate), transformDate(endDate)]);

	const newStartDate = new Date(startDate);
	newStartDate.setDate(newStartDate.getDate() - daysToAdd);

	const newEndDate = new Date(endDate);
	newEndDate.setDate(newEndDate.getDate() + daysToAdd);

	return generateAlternateDates(newStartDate, newEndDate, daysToAdd, datePairs);
};

const transformDate = (date: Date): string => {
	const dateTransformed = date.toLocaleDateString().split("/").reverse();

	const year = Number(dateTransformed[0]);
	const month = Number(dateTransformed[2]) < 10 ? `0${dateTransformed[2]}` : dateTransformed[2];
	const dayDate = Number(dateTransformed[1]) < 10 ? `0${dateTransformed[1]}` : dateTransformed[1];

	return `${year}-${month}-${dayDate}`;
};

export const checkValidDates = (initialDate: string, finalDate: string): boolean => {
	const currentDate = new Date();
	const maxDatePermited = new Date(new Date().setFullYear(new Date().getFullYear() + 4));

	const initialDateObj = new Date(initialDate).getTime();
	const finalDateObj = new Date(finalDate).getTime();

	if (initialDateObj > currentDate.getTime() && finalDateObj < maxDatePermited.getTime()) {
		return true;
	}

	return false;
};

export const numberToSubstractByEnum = (alternativeDateType: string): number => {
	switch (alternativeDateType) {
		case "STANDARD A":
			return 2;
		case "STANDARD B":
			return 3;
		case "STANDARD C":
			return 4;
		default:
			return 2;
	}
};
