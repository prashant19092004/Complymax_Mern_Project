const cron = require("node-cron");
const axios = require("axios");
const adminModel = require("../models/admin.js");
const holidayModel = require("../models/holiday.model.js");
require("dotenv").config();

async function fetchHolidayDataForEstablishment(establishmentId) {
  const currentYear = new Date().getFullYear();
  const savedHolidayIds = [];

  // 🔹 Fetch national holidays
  const response = await axios.get("https://calendarific.com/api/v2/holidays", {
    params: {
      api_key: process.env.CALENDARIFIC_API_KEY,
      country: "IN",
      year: currentYear,
      type: "national",
    },
  });

  const holidays = response.data.response.holidays;

  for (const holiday of holidays) {
    if (!holiday.date || !holiday.date.iso) continue;

    const holidayDate = new Date(holiday.date.iso);
    if (isNaN(holidayDate)) continue;

    const existing = await holidayModel.findOne({
      date: holidayDate,
      establishment: establishmentId,
    });

    if (!existing) {
      const saved = await holidayModel.create({
        name: holiday.name,
        description: holiday.description,
        date: holidayDate,
        type: "official",
        country: holiday.country.name,
        location: holiday.locations,
        establishment: establishmentId,
      });
      savedHolidayIds.push(saved._id);
    } else {
      savedHolidayIds.push(existing._id);
    }
  }

  // 🔹 Add Sundays
  let date = new Date(`${currentYear}-01-01`);
  while (date.getFullYear() === currentYear) {
    if (date.getDay() === 0) {
      const existingSunday = await holidayModel.findOne({
        date,
        establishment: establishmentId,
      });

      if (!existingSunday) {
        const savedSunday = await holidayModel.create({
          name: "Sunday",
          description: "Weekly Off",
          date,
          type: "weekend",
          country: "India",
          location: "All",
          establishment: establishmentId,
        });
        savedHolidayIds.push(savedSunday._id);
      } else {
        savedHolidayIds.push(existingSunday._id);
      }
    }
    date.setDate(date.getDate() + 1);
  }

  // 🔹 Link holidays to establishment
  const establishment = await adminModel.findById(establishmentId);
  if (establishment) {
    establishment.holidays.push(...savedHolidayIds);
    establishment.holiday_added = true;
    await establishment.save();
  }
}

async function runHolidayJobForAllEstablishments() {
  const allEstablishments = await adminModel.find({});

  for (const est of allEstablishments) {
    await fetchHolidayDataForEstablishment(est._id);
    console.log(`Holidays updated for ${est.name}`);
  }
}

// 🕒 Cron to run every Jan 1st at 01:00 AM
cron.schedule("0 1 1 1 *", async () => {
  try {
    console.log("🎉 New Year Holiday Fetch Job Started");
    await runHolidayJobForAllEstablishments();
    console.log("✅ Holiday fetching complete");
  } catch (err) {
    console.error("❌ Error in New Year holiday cron:", err);
  }
});
