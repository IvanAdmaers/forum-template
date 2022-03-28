const userVerification = (verification) => {
  if (!verification) return { status: false };

  const verificationData = { status: true };

  verificationData.message =
    verification.message || 'The user has been verified';

  return verificationData;
};

module.exports = userVerification;
