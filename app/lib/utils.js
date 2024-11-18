const isJsonEmpty = (value) => {
	if (value == null) return true;

	if (typeof value === 'object') {
		return Object.keys(value).length === 0;
	}

	return false;
}


const getStartOfWeek = (date) => {
    const day = date.getDay()
    const diff = (day + 6) % 7
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - diff) 
    startOfWeek.setHours(0, 0, 0, 0)
    return startOfWeek
}

export {isJsonEmpty,getStartOfWeek}