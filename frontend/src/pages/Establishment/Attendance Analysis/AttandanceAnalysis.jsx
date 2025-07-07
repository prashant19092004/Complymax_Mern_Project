import React from "react";
import { useState, useEffect } from "react";
import SummaryCards from "../../../components/Attendance Analysis/SummaryCards";
import AttendanceChart from "../../../components/Attendance Analysis/AttendanceChart";
import StatusOverview from "../../../components/Attendance Analysis/StatusOverview";
import AttendanceTable from "../../../components/Attendance Analysis/AttendanceTable";
import LocationMap from "../../../components/Attendance Analysis/LocationMap";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment-timezone";

const AttandanceAnalysis = () => {
  const [data, setData] = useState();
  const token = localStorage.getItem("token");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calculatedMonthlyData, setCalculatedMonthlyData] = useState();
  const [todaySummery, setTodaySummery] = useState();
  const [monthlyAttendanceRates, setMonthlyAttendanceRates] = useState();

  function calculateMonthlyAttendanceTrends(establishmentData) {
  const users = establishmentData.users || [];

  const todayIST = moment().tz("Asia/Kolkata");
  const thisMonth = todayIST.month();
  const thisYear = todayIST.year();
  const lastMonthDateIST = todayIST.clone().subtract(1, "month");
  const lastMonth = lastMonthDateIST.month();
  const lastYear = lastMonthDateIST.year();

  const thisMonthAllRecords = [];
  const lastMonthAllRecords = [];

  users.forEach((user) => {
    const records = user.attendance || [];
    for (let r of records) {
      const recordDateIST = moment(r.date).tz("Asia/Kolkata");
      const recordMonth = recordDateIST.month();
      const recordYear = recordDateIST.year();

      if (recordMonth === thisMonth && recordYear === thisYear) {
        thisMonthAllRecords.push({ ...r, user: user._id });
      } else if (recordMonth === lastMonth && recordYear === lastYear) {
        lastMonthAllRecords.push({ ...r, user: user._id });
      }
    }
  });

  function calculateStats(monthRecords, baseDateIST) {
    const workingDays = getWorkingDaysOfMonthIST(baseDateIST);
    const totalUsers = users.length;
    const totalWorking = workingDays.length * totalUsers;

    const presentDates = new Set();
    let lateArrivals = 0;
    let earlyDepartures = 0;

    for (let record of monthRecords) {
      const dateKey = `${record.user}_${moment(record.date)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD")}`;
      presentDates.add(dateKey);

      if (record.lateByMinutes && record.lateByMinutes > 0) lateArrivals++;
      if (record.earlyCheckOutByMinutes && record.earlyCheckOutByMinutes > 0)
        earlyDepartures++;
    }

    const present = presentDates.size;
    const absent = totalWorking - present;

    const attendanceRate = totalWorking ? (present / totalWorking) * 100 : 0;
    const absenceRate = totalWorking ? (absent / totalWorking) * 100 : 0;
    const lateArrivalRate = present ? (lateArrivals / present) * 100 : 0;
    const earlyDepartureRate = present ? (earlyDepartures / present) * 100 : 0;

    return {
      present,
      absent,
      totalWorking,
      attendanceRate: +attendanceRate.toFixed(2),
      absenceRate: +absenceRate.toFixed(2),
      lateArrivals,
      lateArrivalRate: +lateArrivalRate.toFixed(2),
      earlyDepartures,
      earlyDepartureRate: +earlyDepartureRate.toFixed(2),
    };
  }

  function calculateChange(current, previous) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return +(((current - previous) / previous) * 100).toFixed(2);
  }

  const thisMonthStats = calculateStats(thisMonthAllRecords, todayIST);
  const lastMonthStats = calculateStats(lastMonthAllRecords, lastMonthDateIST);

  return {
    currentMonth: thisMonthStats,
    lastMonth: lastMonthStats,
    change: {
      attendanceRateChange: calculateChange(
        thisMonthStats.attendanceRate,
        lastMonthStats.attendanceRate
      ),
      absenceRateChange: calculateChange(
        thisMonthStats.absenceRate,
        lastMonthStats.absenceRate
      ),
      lateArrivalRateChange: calculateChange(
        thisMonthStats.lateArrivalRate,
        lastMonthStats.lateArrivalRate
      ),
      earlyDepartureRateChange: calculateChange(
        thisMonthStats.earlyDepartureRate,
        lastMonthStats.earlyDepartureRate
      ),
    },
  };
}


  function getWorkingDaysOfMonthIST(baseDateIST) {
  const year = baseDateIST.year();
  const month = baseDateIST.month();
  const daysInMonth = baseDateIST.daysInMonth();
  const workingDays = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const day = moment.tz({ year, month, day: d }, "Asia/Kolkata").day();
    if (day !== 0 && day !== 6) {
      workingDays.push(moment.tz({ year, month, day: d }, "Asia/Kolkata").format("YYYY-MM-DD"));
    }
  }

  return workingDays;
}

const getMonthlyAttendanceRates = (establishmentData) => {
  const users = establishmentData.users || [];
  const currentYear = moment().tz("Asia/Kolkata").year();

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: moment().month(i).format("MMM"), // Jan, Feb, etc.
    presentCount: 0,
    totalWorking: 0,
  }));

  users.forEach((user) => {
    user.attendance?.forEach((record) => {
      const recordDateIST = moment(record.date).tz("Asia/Kolkata");
      if (recordDateIST.year() === currentYear) {
        const monthIndex = recordDateIST.month(); // 0–11
        months[monthIndex].presentCount += 1;
      }
    });
  });

  // Calculate working days for each month using IST
  months.forEach((m, i) => {
    const workingDays = getWorkingDaysOfMonthIST2(moment().year(currentYear).month(i).toDate());
    m.totalWorking = workingDays.length * users.length;
  });

  const rates = months.map((m) => ({
    month: m.month,
    rate: m.totalWorking > 0 ? +((m.presentCount / m.totalWorking) * 100).toFixed(1) : 0,
  }));

  return rates;
};

function getWorkingDaysOfMonthIST2(baseDate = new Date()) {
  const start = moment(baseDate).tz("Asia/Kolkata").startOf("month");
  const end = moment(baseDate).tz("Asia/Kolkata").endOf("month");
  const workingDays = [];

  let current = start.clone();

  while (current.isSameOrBefore(end, 'day')) {
    const day = current.day();
    if (day !== 0 && day !== 6) {
      workingDays.push(current.format("YYYY-MM-DD"));
    }
    current.add(1, "day");
  }

  return workingDays;
}




  function getTodaySummary(userList = []) {
  const istToday = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

  let present = 0;
  let absent = 0;
  let late = 0;
  let early = 0;

  userList.forEach((user) => {
    const todayRecord = user.attendance.find((record) => {
      const dateStr = moment(record.date).tz("Asia/Kolkata").format("YYYY-MM-DD");
      return dateStr === istToday;
    });

    if (todayRecord) {
      present++;

      if (todayRecord.lateByMinutes && todayRecord.lateByMinutes > 0) {
        late++;
      }

      if (todayRecord.earlyCheckOutByMinutes && todayRecord.earlyCheckOutByMinutes > 0) {
        early++;
      }
    } else {
      absent++;
    }
  });

  const total = userList.length;

  return {
    totalEmployees: total,
    present,
    absent,
    late,
    early,
    latePercentage: total > 0 ? ((late / total) * 100).toFixed(1) : "0",
    earlyPercentage: total > 0 ? ((early / total) * 100).toFixed(1) : "0",
    attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : "0",
    absenceRate: total > 0 ? ((absent / total) * 100).toFixed(1) : "0",
  };
}


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/establishment/attendance/records`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setData(response.data.establishmentData);

        setCalculatedMonthlyData(
          calculateMonthlyAttendanceTrends(response.data?.establishmentData)
        );


        setTodaySummery(
          getTodaySummary(response.data?.establishmentData?.users)
        );

        setMonthlyAttendanceRates(
          getMonthlyAttendanceRates(response.data?.establishmentData)
        );

        // setCheckedIn(isCheckedInToday(response?.data?.userData?.attendance));
        // setPresentDays(getMonthlyPresentCount(response?.data?.userData?.attendance));
        // setBalanceLeave(calculateBalanceLeave(response?.data?.userData));
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching user data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, refreshKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log(calculatedMonthlyData);
  // console.log(todaySummery);
  console.log(data);

  return (
    <div
      style={{ background: "#f5f7ff", minHeight: "100vh", paddingTop: "1rem" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Attendance Dashboard
      </h2>
      <SummaryCards calculatedMonthlyData={calculatedMonthlyData} />
      <AttendanceChart monthlyAttendanceRates={monthlyAttendanceRates} />
      <StatusOverview todaySummery={todaySummery} />
      <AttendanceTable users={data?.users}/>
      {/* <LocationMap /> */}
      <div style={{ height: "100px", width: "100%" }}></div>
    </div>
  );
};

export default AttandanceAnalysis;
