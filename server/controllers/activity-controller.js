const Activity = require("../models/activity-model");

// Track user activity
const trackActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      activityType,
      feature,
      action,
      inputData,
      outputData,
      metadata,
      timestamp
    } = req.body;

    // Validate required fields
    if (!activityType || !feature || !action) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: activityType, feature, action"
      });
    }

    // Get additional metadata from request
    const sessionId = req.sessionID || req.headers['x-session-id'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const activity = new Activity({
      userId,
      username: req.user.username,
      email: req.user.email,
      activityType,
      feature,
      action,
      inputData: inputData || {},
      outputData: outputData || {},
      metadata,
      timestamp: timestamp || new Date(),
      sessionId,
      ipAddress,
      userAgent
    });

    const savedActivity = await activity.save();
    console.log("Activity saved successfully:", savedActivity._id);

    res.status(201).json({
      success: true,
      message: "Activity tracked successfully",
      activityId: savedActivity._id
    });
  } catch (error) {
    console.error("Error tracking activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track activity",
      error: error.message
    });
  }
};

// Get user activity history
const getActivityHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      startDate,
      endDate,
      feature,
      activityType,
      limit = 50,
      offset = 0,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { userId };

    // Date filtering
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Feature filtering
    if (feature) query.feature = feature;
    if (activityType) query.activityType = activityType;

    // Execute query with pagination and sorting
    const activities = await Activity.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    // Get total count for pagination
    const totalCount = await Activity.countDocuments(query);

    // Group activities by date for better organization
    const groupedActivities = activities.reduce((acc, activity) => {
      const date = activity.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        activities: groupedActivities,
        totalCount,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: (offset + limit) < totalCount
      }
    });
  } catch (error) {
    console.error("Error fetching activity history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity history",
      error: error.message
    });
  }
};

// Get activity statistics
const getActivityStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30' } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get activity counts by feature
    const featureStats = await Activity.aggregate([
      {
        $match: {
          userId: userId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$feature',
          count: { $sum: 1 },
          lastActivity: { $max: '$timestamp' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get activity counts by type
    const typeStats = await Activity.aggregate([
      {
        $match: {
          userId: userId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get daily activity counts
    const dailyStats = await Activity.aggregate([
      {
        $match: {
          userId: userId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Get total activity count
    const totalActivities = await Activity.countDocuments({
      userId,
      timestamp: { $gte: startDate }
    });

    res.status(200).json({
      success: true,
      data: {
        totalActivities,
        period: parseInt(period),
        featureStats,
        typeStats,
        dailyStats
      }
    });
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity statistics",
      error: error.message
    });
  }
};

// Delete specific activity
const deleteActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { activityId } = req.params;

    const result = await Activity.findOneAndDelete({
      _id: activityId,
      userId: userId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Activity not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete activity",
      error: error.message
    });
  }
};

// Clear all user activities
const clearAllActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Activity.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} activities successfully`
    });
  } catch (error) {
    console.error("Error clearing activities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear activities",
      error: error.message
    });
  }
};

module.exports = {
  trackActivity,
  getActivityHistory,
  getActivityStats,
  deleteActivity,
  clearAllActivities
};
