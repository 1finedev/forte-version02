import { getSession } from "next-auth/react";
import User from "../../../backend/userModel";
import axios from "axios";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  if (req.method === "POST") {
    await connectToDatabase();
    const session = await getSession({ req });
    if (!session) {
      res.status(200).json({ status: "error", error: "You are not logged in" });
    }
    const { mobile, otp, changeMobile, verifyAccount } = req.body;

    if (
      (!otp && !mobile && changeMobile === true) ||
      (!otp && verifyAccount === true)
    ) {
      return res
        .status(200)
        .json({ status: "error", error: "Please fill all the fields" });
    }

    try {
      const user = await User.find({
        otp: otp,
        otpExpiresAt: { $gte: Date.now() },
      });
      if (user.length < 1) {
        return res.status(200).json({
          status: "error",
          error: "Code is invalid or has expired! please try again!",
        });
      }

      if (changeMobile === true) {
        const response = await User.findByIdAndUpdate(
          { _id: session.user._id },
          {
            mobile,
            otp: null,
            otpExpiresAt: null,
          }
        );
        return res.status(200).json({
          status: "success",
          msg: "Profile updated successfully!",
          data: response,
        });
      } else if (verifyAccount === true) {
        const response = await User.findByIdAndUpdate(
          { _id: session.user._id },
          {
            verified: true,
            otp: null,
            otpExpiresAt: null,
          }
        );

        // send a message to the admin
        const body = `Hello Admin, 
A new verified agent has joined your organization

Details:  

Name: ${response.fullname}
Mobile: ${response.mobile}
Agent Code: ${response.agentId}

This message is automated and sent by the server`;

        const values = {
          body: body,
          phone: "905526157375",
        };

        axios
          .post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            values,
            { withCredentials: true }
          )
          .catch((err) => {
            console.log(err);
            axios.post(
              "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
              {
                body: `Message delivery failed! \n${err}`,
                phone: "905526157375",
              }
            );
          });

        return res.status(200).json({
          status: "success",
          msg: "Profile updated successfully!",
          data: response,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(200).json({ status: "error", error: error.message });
    }
  }
};
export default handler;
