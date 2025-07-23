@echo off
cd /d D:\Safety\safety-portal\backend
node sendAuditReminders.js >> reminder_log.txt 2>&1
