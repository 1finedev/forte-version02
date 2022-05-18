import { connectToDatabase } from "./../../../backend/dbConnect";
import { getSession } from "next-auth/react";
import Funds from "../../../backend/fundsModel";
import User from "../../../backend/userModel";
import axios from "axios";
import { startOfDay, endOfDay } from "date-fns";

const handler = async (req, res) => {
  await connectToDatabase();
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session) {
      return res.status(200).json({
        status: "error",
        error: "You must be logged in!",
      });
    }

    const { amount, bankName, accountNumber, comment } = req.body;

    try {
      try {
        const user = await User.findOne({ _id: session.user._id });

        if (user.balance < amount) {
          return res.status(200).json({
            status: "error",
            error: "Insufficient balance!",
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }

      const withdrawal = await Funds.create({
        name: "Withdrawal request",
        type: "debit",
        amount,
        bankName,
        accountNumber,
        comment,
        user: session.user._id,
      });

      await User.findByIdAndUpdate(
        { _id: session.user._id },
        { $inc: { balance: -amount } }
      );

      const body = `🚨 NOTICE!!!

Agent ${session.user.agentId} has sent a withdrawal request!
Kindly review the details on the admin portal and confirm the request.

*This message is automated and sent to you by the portal.*`;

      const values = {
        body: body,
        phone: "905526157375",
      };

      axios
        .post(
          "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
          values
        )
        .then((res) => {
          axios.post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            {
              body: body,
              phone: "905342274973",
            }
          );
        })
        .catch((err) => {
          console.log(err);
          axios.post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            {
              body: `Withdrawal Update message failed! \n${err}`,
              phone: "905526157375",
            }
          );
        });
      return res.status(200).json({
        status: "success",
        data: withdrawal,
      });
    } catch (error) {
      console.error(error);
      return res.status(200).json({
        status: "error",
        error: "An error occurred while processing your request",
      });
    }
  }
};
export default handler;
