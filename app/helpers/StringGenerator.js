'use server'
const { formatDate } = require("../lib/DataFilter");

const getToken = (length) => {
	let result = '';
	const characters =
	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
  };

const generateRefNo = () => {
	const string = randomstring.generate({
		charset: "0123456789", 
		length: 12
	});

	return `${formatDate(new Date())}-${string}`
};
export {getToken,generateRefNo}