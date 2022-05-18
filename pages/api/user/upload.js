import { connectToDatabase } from "./../../../backend/dbConnect";
import User from "./../../../backend/userModel";
import { getSession } from "next-auth/react";

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    if (!req.body) {
      return res.status(200).json({
        status: "error",
        error: "Please provide a file",
      });
    }
    try {
      const uploadResponse = await cloudinary.uploader.upload(
        req.body.fileStr,
        {
          upload_preset: "forte_bridge",
        }
      );
      const photoUrl = uploadResponse.url;
      const updatedUser = await User.findByIdAndUpdate(
        session.user._id,
        { photo: photoUrl },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({ status: "success", user: updatedUser });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ status: "error", error: "Upload Failed" });
    }
  }
};
export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
