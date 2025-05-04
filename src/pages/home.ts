import { fetchScheduleData } from "../schedule";
import renderDateSlider from "../chart/date-slider";
import renderSquare from "../chart/square";
import { dateToRecordsKey, lastDayPlayed } from "../utils";

const renderHomePage = async () => {
  const scheduleData = await fetchScheduleData("2025");
  const lastDay = lastDayPlayed(scheduleData.end);

  renderDateSlider(scheduleData, () => {});
  renderSquare(scheduleData.records[dateToRecordsKey(lastDay)]);
};

export default renderHomePage;
