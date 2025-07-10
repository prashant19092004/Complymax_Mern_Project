import React from "react";
import { SlCalender } from "react-icons/sl";
import { CgSandClock } from "react-icons/cg";
import { SiTicktick } from "react-icons/si";
import { LuBrainCircuit } from "react-icons/lu";

const HolidayStatsSection = () => {
  return (
    <>
      <div class="phm-stats-container">
        <div class="phm-stat-card total-holidays">
          <div class="phm-icon"><SlCalender /></div>
          <div class="phm-stat-info">
            <p class="phm-stat-title">Total Holidays</p>
            <p class="phm-stat-value">15</p>
          </div>
        </div>
        <div class="phm-stat-card this-week">
          <div class="phm-icon"><SlCalender /></div>
          <div class="phm-stat-info">
            <p class="phm-stat-title">This Week</p>
            <p class="phm-stat-value">3</p>
          </div>
        </div>
        <div class="phm-stat-card upcoming">
          <div class="phm-icon"><CgSandClock /></div>
          <div class="phm-stat-info">
            <p class="phm-stat-title">Upcoming</p>
            <p class="phm-stat-value">4</p>
          </div>
        </div>
        <div class="phm-stat-card official">
          <div class="phm-icon"><SiTicktick /></div>
          <div class="phm-stat-info">
            <p class="phm-stat-title">Official Holidays</p>
            <p class="phm-stat-value">9</p>
          </div>
        </div>
        <div class="phm-stat-card custom">
          <div class="phm-icon"><LuBrainCircuit /></div>
          <div class="phm-stat-info">
            <p class="phm-stat-title">Custom Holidays</p>
            <p class="phm-stat-value">6</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HolidayStatsSection;
