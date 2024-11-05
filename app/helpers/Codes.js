"use strict";

exports.getCodes = (code) => {
	const responseCodes = {
		POC0004: {
			code: 4,
			message: "No Record Found",
		},
		POC0003: {
			code: 3,
			message: "Bad Request",
		},
		POC0002: {
			code: 2,
			message: "System Error",
		},
		POC0001: {
			code: 1,
			message: "Unsuccessful",
		},
		POC0000: {
			code: 0,
			message: "Successful",
		},
	};

	return responseCodes[code];
};