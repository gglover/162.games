import * as d3 from "d3";
import { ScheduleData } from "../interfaces";
import { SQUARE_SIZE } from "./constants";
import { lastDayPlayed } from "../utils";

const renderDateSlider = (
  scheduleData: ScheduleData,
  onChange: (date: Date) => void
) => {
  const dateSlider = document.querySelector(".date-slider")!;
  // const dateSliderScale = document.querySelector(".date-slider-scale")!;

  const lastDay = lastDayPlayed(scheduleData.end);

  const xScale = d3
    .scaleTime()
    .domain([scheduleData.start, lastDay])
    .range([0, SQUARE_SIZE]);

  // const svg = d3.create("svg").attr("width", SQUARE_SIZE).attr("height", 20);
  // const scale = svg.append("g");

  // // @ts-ignore
  // const xAxis = d3.axisBottom(xScale); //.tickFormat(d3.timeFormat("%b"));

  // scale
  //   .append("g")
  //   .attr("class", "x-axis")
  //   .attr("transform", `translate(0, 0)`)
  //   .call(xAxis);

  // dateSliderScale.append(svg.node()!);

  // dateSlider.setAttribute("");
};

export default renderDateSlider;
