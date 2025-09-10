// Temporary storage for pending user registrations
// In production, consider using Redis or a proper cache system

const pendingUsers = new Map();

// Store pending user data with OTP
const storePendingUser = (email, userData) => {
  console.log("Storing pending user:", email);
  pendingUsers.set(email, {
    ...userData,
    createdAt: new Date()
  });
  
  // Auto-cleanup after 15 minutes
  setTimeout(() => {
    if (pendingUsers.has(email)) {
      console.log("Auto-cleaning expired pending user:", email);
      pendingUsers.delete(email);
    }
  }, 15 * 60 * 1000);
};

// Get pending user data
const getPendingUser = (email) => {
  console.log("Getting pending user:", email);
  return pendingUsers.get(email);
};

// Remove pending user data (after successful verification)
const removePendingUser = (email) => {
  console.log("Removing pending user:", email);
  return pendingUsers.delete(email);
};

// Check if user is pending
const isPendingUser = (email) => {
  return pendingUsers.has(email);
};

// Get all pending users (for debugging)
const getAllPendingUsers = () => {
  return Array.from(pendingUsers.keys());
};

module.exports = {
  storePendingUser,
  getPendingUser,
  removePendingUser,
  isPendingUser,
  getAllPendingUsers
};
