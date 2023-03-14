import {EnumJobAlternativesDate} from "../../src/services/enumJobAlternativesDate";

export const convertStringToEnumAlternativeDate = (alternativeDate: string) => {
	alternativeDate = !alternativeDate ? "" : alternativeDate.toUpperCase();

	switch (alternativeDate) {
		case "STANDARD A":
		case "STANDARD_A":
		case "STANDARDA":
			return EnumJobAlternativesDate.STARDARD_A;
		case "STANDARD B":
		case "STANDARD_B":
		case "STANDARDB":
			return EnumJobAlternativesDate.STARDARD_B;
		case "STANDARD C":
		case "STANDARD_C":
		case "STANDARDC":
			return EnumJobAlternativesDate.STARDARD_C;
		default:
			return EnumJobAlternativesDate.STARDARD_A;
	}
};
