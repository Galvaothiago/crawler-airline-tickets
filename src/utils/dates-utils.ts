const incrementOrDecrementDate = (date: string, day: number) => {
	const currentDate = new Date(date);

	switch (day) {
		case 0:
			break;
		case 1:
			currentDate.setDate(currentDate.getDate() + 1);
			break;
		case 2:
			currentDate.setDate(currentDate.getDate() + 2);
			break;
		case 3:
			currentDate.setDate(currentDate.getDate() + 3);
			break;
		case 4:
			currentDate.setDate(currentDate.getDate() + 4);
			break;
		case 5:
			currentDate.setDate(currentDate.getDate() + 5);
			break;
		case -1:
			currentDate.setDate(currentDate.getDate() - 1);
			break;
		case -2:
			currentDate.setDate(currentDate.getDate() - 2);
			break;
		case -3:
			currentDate.setDate(currentDate.getDate() - 3);
			break;
		case -4:
			currentDate.setDate(currentDate.getDate() - 4);
			break;
		case -5:
			currentDate.setDate(currentDate.getDate() - 5);
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

export const getAlternativesDate = (initialDate: string, finalDate: string, alternativeDateType: string): string[][] => {
	const alternativeDates: Set<string[]> = new Set();
	const MAX_NUMBER_TO_PERMUTE = 4; // Will be used to limit the number of permutations, (4! = 24) for each date it will return 24 alternative dates
	const MAX_DAY_TO_SUBSTRACT = numberToSubstractByEnum(alternativeDateType); // Will be used to limit the number of days to substract from the initial date

	for (let i = 0; i < MAX_NUMBER_TO_PERMUTE; i++) {
		for (let j = 0; j < MAX_NUMBER_TO_PERMUTE; j++) {
			const dates = [
				incrementOrDecrementDate(initialDate, i - MAX_DAY_TO_SUBSTRACT),
				incrementOrDecrementDate(finalDate, j - MAX_DAY_TO_SUBSTRACT),
			];

			alternativeDates.add(dates);
		}
	}

	const convertToArr: string[][] = Array.from(alternativeDates);

	return convertToArr;
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
			return 4;
		case "STANDARD C":
			return 6;
		default:
			return 2;
	}
};
