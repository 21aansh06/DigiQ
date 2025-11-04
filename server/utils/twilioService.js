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

export const sendOTP = async (phone, otp) => {
  try {
    const twilioClient = getTwilioClient();
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!phoneNumber || phoneNumber === "+1234567890") {
      throw new Error("Twilio phone number is not configured. Please set TWILIO_PHONE_NUMBER in your .env file.");
    }

    const message = await twilioClient.messages.create({
      body: `Your QueueLess OTP is: ${otp}`,
      from: phoneNumber,
      to: phone
    });
    return message.sid; // optional, just for logging
  } catch (error) {
    console.error("Twilio Error:", error);
    throw new Error("Failed to send OTP");
  }
};
