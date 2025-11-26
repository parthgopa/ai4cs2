const User = require("../models/user-model");

// Validate base64 image
const validateBase64Image = (base64String) => {
  // Check if it's a valid base64 string
  if (!base64String) return false;
  
  // Accept any image format with base64 data
  // This is more permissive to handle various image formats and encodings
  if (typeof base64String === 'string' && base64String.includes('base64')) {
    // Check size (roughly - base64 is ~33% larger than binary)
    // Limit to ~2MB after base64 encoding (which is ~1.5MB of actual image)
    const approximateSize = base64String.length * (3/4);
    if (approximateSize > 2 * 1024 * 1024) {
      console.log('Image too large:', approximateSize, 'bytes');
      return false;
    }
    return true;
  }
  
  console.log('Invalid base64 format');
  return false;
};

// No middleware needed for base64 images

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fields that can be updated
    const allowedFields = [
      "username",
      "phone",
      "designation",
      "companyName",
      "companyType",
      "cin",
      "address"
    ];

    // Update allowed fields
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle base64 profile image if provided
    if (req.body.profileImage) {
      console.log('Base64 image received, length:', req.body.profileImage.length);
      console.log('Base64 image starts with:', req.body.profileImage.substring(0, 50) + '...');
      
      // Validate the base64 image
      if (!validateBase64Image(req.body.profileImage)) {
        console.log('Base64 image validation failed');
        return res.status(400).json({ 
          message: "Invalid image format or size. Image must be less than 2MB."
        });
      }
      
      console.log('Base64 image validation passed, storing in database');
      // Store the base64 string directly in the database
      updateData.profileImage = req.body.profileImage;
    } else {
      console.log('No profile image provided in request');
    }

    // Mark profile setup as complete (for first-time login modal)
    updateData.isProfileSetupComplete = true;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    // Remove sensitive fields
    const userResponse = { ...updatedUser._doc };
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;
    delete userResponse.otpAttempts;
    delete userResponse.failedLoginAttempts;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      message: "Failed to update profile",
      error: error.message 
    });
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { preferences, companyName, companyType, cin } = req.body;
    
    // Update data object
    const updateData = {};
    
    // Update company info if provided
    if (companyName !== undefined) updateData.companyName = companyName;
    if (companyType !== undefined) updateData.companyType = companyType;
    if (cin !== undefined) updateData.cin = cin;
    
    // Update preferences if provided
    if (preferences) {
      // Get current preferences or initialize empty object
      const currentPreferences = user.preferences || {};
      
      // Update specific preference fields
      if (preferences.autoFillForms !== undefined) {
        updateData["preferences.autoFillForms"] = preferences.autoFillForms;
      }
      
      if (preferences.defaultQuarters !== undefined) {
        updateData["preferences.defaultQuarters"] = preferences.defaultQuarters;
      }
      
      if (preferences.darkModePreference !== undefined) {
        updateData["preferences.darkModePreference"] = preferences.darkModePreference;
      }
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Remove sensitive fields
    const userResponse = { ...updatedUser._doc };
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;
    delete userResponse.otpAttempts;
    delete userResponse.failedLoginAttempts;

    res.status(200).json({
      message: "Preferences updated successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Preferences update error:", error);
    res.status(500).json({ 
      message: "Failed to update preferences",
      error: error.message 
    });
  }
};

module.exports = { 
  updateProfile,
  updatePreferences
};
