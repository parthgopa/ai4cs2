const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const {
  trackActivity,
  getActivityHistory,
  getActivityStats,
  deleteActivity,
  clearAllActivities
} = require("../controllers/activity-controller");

// All routes require authentication
router.use(authMiddleware);

// POST /api/activity/track - Track user activity
router.post("/track", trackActivity);

// GET /api/activity/history - Get user activity history with filtering
router.get("/history", getActivityHistory);

// GET /api/activity/stats - Get activity statistics
router.get("/stats", getActivityStats);

// DELETE /api/activity/clear - Clear all user activities (must be before :activityId)
router.delete("/clear", clearAllActivities);

// DELETE /api/activity/:activityId - Delete specific activity
router.delete("/:activityId", deleteActivity);

module.exports = router;
