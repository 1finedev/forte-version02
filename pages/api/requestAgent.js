import { connectToDatabase } from "./../../backend/dbConnect";
import Feedback from "./../../backend/feedbackModel";
import User from "./../../backend/userModel";
const TinyURL = require("tinyurl");
import axios from "axios";

const handler = async (req, res) => {
  if (req.method === "POST") {
    await connectToDatabase();
    const { name, mobile, services } = req.body;

    if (!name || !mobile || services.length === 0) {
      return res.status(200).json({
        status: "error",
        error: "Incomplete details received!",
      });
    }

    const feedback = await Feedback.create({
      name,
      mobile,
      services: services[0],
    });

    const pro = await Promise.all(
      services[0].map(async (interest, index) => {
        try {
          // find one user with each of the interest
          const user = await User.findOne({
            service: interest,
            role: "agent",
          })
            .sort({ customerMatchCount: 1 })
            .limit(1);

          // increase the customer match count of the user
          await User.findByIdAndUpdate(user._id, {
            customerMatchCount: user.customerMatchCount + 1,
          });

          // include the connected agent in the customer list
          await Feedback.findByIdAndUpdate(
            { _id: feedback._id },
            {
              $push: { agents: user._id },
            },
            { new: true, upsert: true }
          );
          // create whatsappLink
          const whatsappLink = `https://api.whatsapp.com/send?phone=${user.mobile}&text=Hi,%20you%20have%20been%20assigned%20to%20me%20by%20%22Forte%20Bridge%20Customer%20Matching%20Portal%22%20my%20name%20is%20${name}%20and%20i%20am%20interested%20in%20${interest}`;
          // shorten the whatsapp link
          const url = await TinyURL.shorten(whatsappLink);

          //   construct message body
          const body = `Hello ${req.body.name.toUpperCase()},
Thank you for choosing forte-bridge global logistics.

Click the links to contact the agents assigned to you based on your interests`;

          const body2 = `${url}`;

          const body3 = `Hello ${user.agentId.toUpperCase()}
We have assigned ${req.body.name.toUpperCase()} to you for ${interest}, if they do not message you, you can reach them on ${mobile}`;

          const values = {
            body: body,
            phone: mobile,
          };
          const values2 = {
            body: body2,
            phone: mobile,
          };
          const values3 = {
            body: body3,
            phone: user.mobile.toString(),
          };
          try {
            if (index === 1) {
              await axios.post(
                "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
                values
              );
            }
            await axios.post(
              "https://eu176.chat-api.com/instance225964/sendLink?token=u10endg0wkm7iu17",
              values2
            );

            await axios.post(
              "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
              values3
            );
          } catch (error) {
            console.log(error);
            await axios.post(
              "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
              {
                body: `Message delivery failed! \customer: ${mobile} \agent: ${user.fullname} \nReason: ${err.message}`,
                phone: "905526157375",
              }
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      })
    );

    await pro;
    return res.status(200).json({ status: "success" });
  } else {
    return res
      .status(200)
      .json({ status: "error", error: "Method not allowed" });
  }
};

export default handler;
