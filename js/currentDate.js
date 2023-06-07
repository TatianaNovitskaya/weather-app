function formatDate() {
  let currentDate = document.querySelector(".today-date");
  let now = new Date();
  let currentWeekDay = new Intl.DateTimeFormat("en-US", {
    weekday: "long"
  }).format(now);
  let currentMonth = now.toLocaleString("en-us", { month: "long" });
  let currentDay = now.getDate();
  let hours = now.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let currentTime = `${now.getHours()}:${hours}`;
  currentDate.innerText = `${currentWeekDay},  ${currentMonth} ${currentDay}, ${currentTime}`;
  let currentDateFormat = currentDate;
  return currentDateFormat;
}
formatDate(new Date());
