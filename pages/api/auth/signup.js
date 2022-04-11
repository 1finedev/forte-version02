import User from "../../../backend/userModel";
import { connectToDatabase } from "./../../../backend/dbConnect";

export const handler = async (req, res) => {
  if (req.method === "POST") {
    await connectToDatabase();
    const { fullname, agentId, mobile, password } = req.body.value;

    if (!password || !fullname || !agentId || !mobile) {
      return res.status(200).json({ error: "Incomplete Credentials" });
    }

    // check if user exists
    try {
      const user = await User.findOne({
        $or: [{ agentId: agentId.replace(" ", "") }, { mobile }],
      });
      // throw error if user exists
      if (user) {
        return res.status(200).json({ error: "User already exists!" });
      }
    } catch (error) {
      return res.status(200).json({ error: "Internal Server Error" });
    }

    // create user  and hash password
    try {
      const newUser = await User.create({
        fullname,
        agentId: agentId.replace(" ", ""),
        mobile,
        password,
      });

      newUser.password = undefined;

      if (newUser) {
        // generate otp  and send to user
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresAt = Date.now() + 10 * 60 * 1000;

        // send a message to the user and generate otp
        await User.findByIdAndUpdate(newUser._id, {
          otp,
          otpExpiresAt,
        });

        return res.status(201).json({
          status: "success",
          msg: "Account created successfully",
          userId: newUser._id,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  } else {
    return res
      .status(200)
      .json({ error: "No handler defined for this route!" });
  }
};

export default handler;
