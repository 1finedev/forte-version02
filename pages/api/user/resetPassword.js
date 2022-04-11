import User from "./../.././../backend/userModel";
const crypto = require("crypto");
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  if (req.method === "POST") {
    await connectToDatabase();
    const { password, passwordConfirm, token } = req.body;
    if (!password || !passwordConfirm || !token) {
      return res.status(200).json({
        status: "error",
        error: "All fields are required!",
      });
    }

    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(200).json({
        status: "error",
        error: "Token is invalid or has expired",
      });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user and return
    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } else {
    return res.status(200).json({
      status: "error",
      error: `Method not allowed!`,
    });
  }
};

export default handler;
