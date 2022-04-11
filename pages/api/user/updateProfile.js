import { getSession } from "next-auth/react";
import User from "./../../../backend/userModel";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session) {
      return res
        .status(200)
        .json({ status: "error", error: "You are not logged in" });
    }
    const { fullname, mobile, bankName, accountNumber, services } = req.body;

    if (req.body.agentCode) {
      return res.status(200).json({
        status: "error",
        error: "some fields cannot be changed!",
      });
    }

    try {
      const data = await User.findByIdAndUpdate(
        { _id: session.user._id },
        {
          fullname: fullname ? fullname.toUpperCase() : session.user.fullname,
          bankName: bankName ? bankName.toUpperCase() : session.user.bankName,
          accountNumber: accountNumber
            ? accountNumber
            : session.user.accountNumber,
          services: services ? services : session.user.services,
        }
      );

      if (mobile) {
        const user = await User.findOne({ mobile: mobile });
        if (user) {
          return res.status(200).json({
            status: "error",
            error: "Mobile number already exists!",
          });
        }
        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresAt = Date.now() + 10 * 60 * 1000;

        // send a message to the user and generate otp
        const body = `Hello ${user.fullname.split()[0]}, 
Use  *${otp}* as the code for your verification. 
This code will expire in 10 minutes.`;

        const values = {
          body: body,
          phone: user.mobile,
        };

        axios
          .post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            values
          )
          .catch((err) => {
            axios.post(
              "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
              {
                body: `Message delivery failed! \n${err}`,
                phone: "905526157375",
              }
            );
            console.log(err);
          });

        await User.findByIdAndUpdate(user._id, {
          otp,
          otpExpiresAt,
        });

        return res.status(200).json({
          status: "success",
          msg: "Profile updated successfully!",
          data: data,
          mobile: mobile,
        });
      } else {
        return res.status(200).json({
          status: "success",
          msg: "Profile updated successfully!",
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(200).json({ status: "error", error: error.message });
    }
  }
};
export default handler;
