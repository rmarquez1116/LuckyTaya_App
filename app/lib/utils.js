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
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();

  // If the current month is before the birth month or it's the birth month but today's day is before the birth day
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age--; // subtract one from the age if the birthday hasn't occurred yet this year
  }

  return age;
}

function formatAccountNumber(str) {
  return str.replace(/(.{4})(?=.)/g, '$1-');
}

const PHTimeOptions = {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true, // Use 12-hour format
};


export { PHTimeOptions,isJsonEmpty, getStartOfWeek, calculateAge, formatAccountNumber }