const isJsonEmpty = (value) => {
	if (value == null) return true;

	if (typeof value === 'object') {
		return Object.keys(value).length === 0;
	}

	return false;
}

export {isJsonEmpty}