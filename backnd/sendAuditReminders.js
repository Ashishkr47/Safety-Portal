// // backend/sendAuditReminders.js
// const fs = require("fs");
// const path = require("path");
// const { getAccessToken } = require("./auth");
// const { sendEmailViaGraph } = require("./emailUtils");

// const auditConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "auditConfig.json")));
// const lastAuditDatesFile = path.join(__dirname, "lastAuditDates.json");

// let lastAuditDates = {};
// if (fs.existsSync(lastAuditDatesFile)) {
//   lastAuditDates = JSON.parse(fs.readFileSync(lastAuditDatesFile));
// }

// const today = new Date();
// today.setHours(0, 0, 0, 0);

// function getNextDueDate(lastDateStr, frequency) {
//   const lastDate = new Date(lastDateStr);
//   lastDate.setHours(0, 0, 0, 0);
//   if (frequency === "monthly") lastDate.setMonth(lastDate.getMonth() + 1);
//   else if (frequency === "fortnightly") lastDate.setDate(lastDate.getDate() + 14);
//   else if (frequency === "weekly") lastDate.setDate(lastDate.getDate() + 7);
//   return lastDate;
// }

// function isReminderDay(dueDate) {
//   const diff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
//   return diff === 1;
// }

// function isMissedDay(dueDate) {
//   return dueDate.getTime() === today.getTime();
// }

// async function main() {
//   const token = await getAccessToken();

//   for (const auditName in auditConfig) {
//     const { frequency, responsibles } = auditConfig[auditName];
//     const lastDateStr = lastAuditDates[auditName];

//     if (!lastDateStr) continue;

//     const nextDueDate = getNextDueDate(lastDateStr, frequency);

//     if (isReminderDay(nextDueDate)) {
//       const subject = `Reminder: ${auditName} Audit is due tomorrow`;
//       const content = `Dear Responsible Person,\n\nThe ${auditName} audit is due on ${nextDueDate.toDateString()}.\nPlease ensure it is completed.\n\nRegards,\nSafety Portal`;

//       for (const email of responsibles) {
//         await sendEmailViaGraph(token, email, subject, content);
//       }
//     }

//     if (isMissedDay(nextDueDate)) {
//       const subject = `Missed: ${auditName} Audit was due yesterday`;
//       const content = `Dear Responsible Person,\n\nThe ${auditName} audit was due on ${nextDueDate.toDateString()} and has not been submitted.\nPlease take action.\n\nRegards,\nSafety Portal`;

//       for (const email of responsibles) {
//         await sendEmailViaGraph(token, email, subject, content);
//       }
//     }
//   }
// }

// main();

const fs = require("fs");
const path = require("path");
const { sendEmailViaNodemailer } = require("./emailUtils"); // Import nodemailer utility

// Load config files
const auditConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "auditConfig.json")));
const lastAuditDatesFile = path.join(__dirname, "lastAuditDates.json");

// Load last audit dates
let lastAuditDates = {};
if (fs.existsSync(lastAuditDatesFile)) {
  lastAuditDates = JSON.parse(fs.readFileSync(lastAuditDatesFile));
}
console.log("📄 Loaded lastAuditDates:", lastAuditDates);

// Normalize today's date
const today = new Date();
today.setHours(0, 0, 0, 0);

// Helper to compute due date
function getNextDueDate(lastDateStr, frequency) {
  const lastDate = new Date(lastDateStr);
  lastDate.setHours(0, 0, 0, 0);
  if (frequency === "monthly") lastDate.setMonth(lastDate.getMonth() + 1);
  else if (frequency === "fortnightly") lastDate.setDate(lastDate.getDate() + 14);
  else if (frequency === "weekly") lastDate.setDate(lastDate.getDate() + 7);
  return lastDate;
}

function isReminderDay(dueDate) {
  const diffDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

function isMissedDay(dueDate) {
  return dueDate.getTime() === today.getTime();
}

// MAIN FUNCTION
async function main() {
  for (const auditName in auditConfig) {
    const { frequency, responsibles } = auditConfig[auditName];
    const lastDateStr = lastAuditDates[auditName];

    if (!lastDateStr) {
      console.log(`ℹ️ No last audit date recorded for ${auditName}. Skipping.`);
      continue;
    }

    const nextDueDate = getNextDueDate(lastDateStr, frequency);

    if (isReminderDay(nextDueDate)) {
      const subject = `Reminder: ${auditName} Audit is due tomorrow`;
      const content = `Dear Responsible Person,\n\nThe ${auditName} audit is due on ${nextDueDate.toDateString()}.\nPlease ensure it is completed before the due date.\n\nRegards,\nSafety Portal`;

      for (const email of responsibles) {
        await sendEmailViaNodemailer(email, subject, content);
      }
    }

    if (isMissedDay(nextDueDate)) {
      const subject = `Missed: ${auditName} Audit was due yesterday`;
      const content = `Dear Responsible Person,\n\nThe ${auditName} audit was due on ${nextDueDate.toDateString()} and has not been submitted.\nPlease take immediate action.\n\nRegards,\nSafety Portal`;

      for (const email of responsibles) {
        await sendEmailViaNodemailer(email, subject, content);
      }
    }
  }
}

main();

