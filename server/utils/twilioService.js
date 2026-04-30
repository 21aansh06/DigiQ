import Twilio from "twilio";

let client = null;

// Initialize Twilio client only when needed and if credentials are valid
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  // Check if credentials are set and valid
  if (!accountSid || !authToken || 
      accountSid === "your_twilio_account_sid" || 
      authToken === "your_twilio_auth_token" ||
      !accountSid.startsWith("AC")) {
    throw new Error("Twilio credentials are not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file.");
  }

  // Initialize client only if it doesn't exist
  if (!client) {
    client = Twilio(accountSid, authToken);
  }
  
  return client;
};

export const sendOTP = async (phone) => {
  try {
    const twilioClient = getTwilioClient();
    const serviceSid = process.env.TWILIO_SERVICE_SID;
    
    if (!serviceSid || !serviceSid.startsWith("VA")) {
      throw new Error("Twilio Service SID is not configured or invalid. Please set TWILIO_SERVICE_SID in your .env file (it should start with 'VA').");
    }

    const verification = await twilioClient.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phone, channel: "sms" });
      
    return verification.status;
  } catch (error) {
    console.error("Twilio sendOTP Error:", error);
    throw new Error(error.message || "Failed to send OTP via Twilio");
  }
};

export const verifyOTPCode = async (phone, code) => {
  try {
    const twilioClient = getTwilioClient();
    const serviceSid = process.env.TWILIO_SERVICE_SID;

    if (!serviceSid || !serviceSid.startsWith("VA")) {
      throw new Error("Twilio Service SID is not configured or invalid. Please set TWILIO_SERVICE_SID in your .env file.");
    }

    const verificationCheck = await twilioClient.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phone, code: code.toString() });

    return verificationCheck.status === "approved";
  } catch (error) {
    console.error("Twilio verifyOTPCode Error:", error);
    throw new Error(error.message || "Failed to verify OTP via Twilio");
  }
};
