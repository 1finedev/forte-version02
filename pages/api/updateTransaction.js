import Funds from "./../../backend/fundsModel";
import User from "./../../backend/userModel";
import { getSession } from "next-auth/react";
import axios from "axios";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session || session?.user?.role !== "admin") {
      return res
        .status(200)
        .json({ status: "error", error: "You are not logged in" });
    }

    const { transactionId, comment, value } = req.body;
    if (!transactionId || !value) {
      return res.status(200).json({
        status: "error",
        error: "Please provide transactionId and status",
      });
    }
    try {
      const transaction = await Funds.findByIdAndUpdate(transactionId, {
        status: value,
        comment: comment,
      });
      if (value === "Rejected") {
        await User.findByIdAndUpdate(transaction.user._id, {
          $inc: { balance: transaction.amount * 1 },
        });
      }

      // send a message to the agent
      const acceptanceBody = `Hello ${transaction.user.fullname.split(" ")[0]}, 
Your withdrawal request has been *APPROVED* by the Admin.

Kindly check your ${transaction.bankName} account for the requested amount

If you believe this is an error or you did not initiate the withdrawal request.
Kindly contact the admin for further details.

*This message is automated and sent to you by the system.*`;

      const rejectionBody = `Hello ${transaction.user.fullname.split(" ")[0]}, 
Your withdrawal request has been *REJECTED* by the Admin.

Reason: ${transaction.adminComment}

The requested amount has been *REFUNDED* into your available balance
Kindly check your portal to request again after you fix the reason

If you believe this is an error or you did not initiate the withdrawal request.
Kindly contact the admin for further details.

*This message is automated and sent to you by the system.*`;

      const values = {
        body:
          transaction.status === "Rejected" ? rejectionBody : acceptanceBody,
        phone: transaction?.user?.mobile,
      };

      await axios
        .post(
          "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
          values
        )
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

      return res.status(200).json({ status: "success" });
    } catch (error) {
      return res
        .status(200)
        .json({ status: "error", error: "Something went wrong" });
    }
  }
};
export default handler;
