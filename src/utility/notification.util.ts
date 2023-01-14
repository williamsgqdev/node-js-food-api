//OTP
export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return { otp, expiry }
}

export const SendOtp = async (otp: number, phoneNumber: string) => {
    const accountSid = "ACcdc26b02daba12eec207dd64188165c0";
    const authToken = "9ea3533bb5399cceeddbc5e1233753c1";
    const client = require('twilio')(accountSid, authToken);

    const response = await client.messages.create({
        body: `Your Otp is ${otp}`,
        from: '+18057908720',
        to: `+234${phoneNumber}`
    })

    return response;

}


//Email Notification