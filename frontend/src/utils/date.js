import moment from "moment";

export const formatDate = (date) => {
  const now = moment();
  const momentDate = moment(date);

  let time = momentDate.fromNow(true);

  const getDay = () => {
    let days = time.split(" ")[0];

    if (+days < 8) {
      return now.subtract(+days, "days").format("dddd");
    } else {
      return momentDate.format("DD/MM/YYYY");
    }
  };

  if (time === "a few seconds") {
    return "Now";
  }

  if (time.search("minute") !== -1) {
    let mins = time.split(" ")[0];

    if (mins === "a") {
      return "1 min";
    } else {
      return `${mins} min`;
    }
  }

  if (time.search("hour") !== -1) {
    return momentDate.format("HH:mm a");
  }

  if (time === "a day") {
    return "Yesterday";
  }

  if (time.search("days") !== -1) {
    return getDay();
  }

  return time;
};
