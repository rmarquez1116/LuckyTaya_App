"use strict"
import { generateRefNo } from "./StringGenerator";
import { getCodes } from "./Codes";


export const response = (code = "POC0001", data = [], error = null) => {
	let result = {};
	result = getCodes(code);
	if (!error)
		result.data = data;
	else
		result.data = {
			msg: data,
			error: error?.message || error
		};

	result.refNo = generateRefNo()

	return result;
}

export function insertDecimalAtThirdToLast(str) {
	// Check if the string is long enough to have a third-to-last character
	if (str.length < 3) {
		return str; // Return the string unchanged if it's too short
	}

	// Split the string into two parts: everything before the third-to-last character, and everything after
	let beforeDecimal = str.slice(0, str.length - 2);
	let afterDecimal = str.slice(str.length - 2);

	// Insert the decimal before the third-to-last character
	return beforeDecimal + '.' + afterDecimal;
}

export function formatMoney(amount) {
	return new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}