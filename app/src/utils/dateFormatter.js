export const dateFormatter = inputDate => {
  let dateConversion = {
    year: '',
    month: '',
    date: '',
    hours: '',
    minutes: '',
    seconds: ''
  }
  dateConversion.year = inputDate.getFullYear()
  dateConversion.month = inputDate.getMonth() + 1
  dateConversion.date = inputDate.getDate()
  dateConversion.hours = inputDate.getHours()
  dateConversion.minutes = inputDate.getMinutes()
  dateConversion.seconds = inputDate.getSeconds()
  for (let prop in dateConversion) {
    if (dateConversion.hasOwnProperty(prop)) {
      dateConversion[prop] = dateConversion[prop] < 10 ? ('0' + dateConversion[prop]) : dateConversion[prop].toString()
    }
  }
  return dateConversion.year + '-' + dateConversion.month + '-' + dateConversion.date + ' ' + dateConversion.hours + ':' + dateConversion.minutes + ':' + dateConversion.seconds
}

export const timeFormatter = inputTime => {
  let timeConversion = {
    hours: '',
    minutes: '',
    seconds: ''
  }
  timeConversion.hours = inputTime.getHours()
  timeConversion.minutes = inputTime.getMinutes()
  timeConversion.seconds = inputTime.getSeconds()
  for (let prop in timeConversion) {
    if (timeConversion.hasOwnProperty(prop)) {
      timeConversion[prop] = timeConversion[prop] < 10 ? ('0' + timeConversion[prop]) : timeConversion[prop].toString()
    }
  }
  return timeConversion.hours + ':' + timeConversion.minutes + ':' + timeConversion.seconds
}
