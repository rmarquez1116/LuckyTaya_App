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

