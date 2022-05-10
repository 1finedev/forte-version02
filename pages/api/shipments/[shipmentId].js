import Shipment from "./../../../backend/shipmentModel";
import { getSession } from "next-auth/react";
import User from "../../../backend/userModel";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(200).json({
      status: "error",
      error: "You must be logged in!",
    });
  }

  const { shipmentId } = req.query;
  if (!shipmentId) {
    return res.status(200).json({
      status: "error",
      error: "No shipment id provided!",
    });
  }

  // todo: validate request body values
  if (req.method === "POST") {
    try {
      if (req.body.shipment.agentId) {
        const user = await User.findOne({ agentId: req.body.shipment.agentId });
        if (!user) {
          return res.status(200).json({
            status: "error",
            error: "Invalid Agent Code!",
          });
        }
        // check if shipment has been calculated previously and remove the calculated sum
        const previous = await Shipment.findOne({
          _id: req.body.shipment.shipmentId,
        });

        if (previous.calculated === true) {
          await User.findByIdAndUpdate(previous.user._id, {
            $inc: {
              balance: -previous.rebate,
              wallet: -previous.rebate,
              totalKg: -previous.weight,
            },
          });
        }

        const values = {
          user: user._id,
        };
        const shipment = await Shipment.findByIdAndUpdate(
          { _id: shipmentId },
          values,
          {
            new: true,
            runValidators: true,
          }
        ).select(session.role === "sec" ? "-mobile" : "");

        if (shipment.calculated) {
          // update commission on new shipment
          const dollarSide = shipment.dollarSide || process.env.DOLLAR_AGENT;
          const nairaSide = shipment.nairaSide || process.env.NAIRA_AGENT;
          const dollarAgent = shipment.weight * dollarSide;
          const nairaAgent = shipment.weight * nairaSide;
          const convertDollar = dollarAgent * shipment.dollarRate;
          const rebate = Math.round(nairaAgent + convertDollar);

          await Shipment.findByIdAndUpdate(shipment._id, {
            rebate,
            dollarSide,
            nairaSide,
          });
          await User.findByIdAndUpdate(shipment.user, {
            $inc: {
              totalKg: shipment.weight,
              wallet: rebate,
              balance: rebate,
            },
          });
        }
        return res.status(200).json({ status: "success", data: shipment });
      } else {
        let values;
        if (session.user.role === "agent") {
          values = {
            name: req.body.shipment.name.toUpperCase().trim(),
            destination: req.body.shipment.destination.toUpperCase(),
            mobile: req.body.shipment.mobile,
          };
        } else if (
          session.user.role === "sec" ||
          session.user.role === "admin"
        ) {
          values = {
            ...req.body.shipment,
          };
        }
        const shipment = await Shipment.findByIdAndUpdate(
          { _id: shipmentId },
          values,
          {
            new: true,
            runValidators: true,
          }
        );

        if (
          session.user.role === "agent" &&
          shipment.mobile &&
          shipment.rebate &&
          session.user.messageTries > 0
        ) {
          const adminBody = `Phone number just updated!, kindly initiate message please
${shipment.name},
${shipment.weight},
${shipment.mobile}
${shipment.createdAt.split("T")[0]}

${shipment.user.agentId} has ${session.user.messageTries} requests left!`;

          const values = {
            body: adminBody,
            phone: "9055261567375",
          };

          axios
            .post(
              "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
              values
            )
            .then((response) => {
              const agentBody = `Message request successful!, 
You have now used ${
                25 - session.user.messageTries
              } out of your 25 late message credits!
              
Kindly ensure that you have the correct phone number uploaded every time to avoid running out of late message credits`;
              const value = {
                body: agentBody,
                phone: session.user.mobile,
              };
              axios.post(
                "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
                value
              );
            });
        } else if (
          session.user.role === "agent" &&
          shipment.mobile &&
          !shipment.rebate &&
          session.user.messageTries < 1
        ) {
          h;
          const agentBody = `Message request failed! Your late message requests is less than 1!

Error: ${shipment.user.agentId} has ${session.user.messageTries} requests left!`;

          const values = {
            body: agentBody,
            phone: "9055261567375",
          };

          await axios.post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            values
          );
        }

        return res.status(200).json({ status: "success", data: shipment });
      }
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        error: "An error occurred!",
      });
    }
  } else if (req.method === "DELETE") {
    if (session.user.role !== "admin") {
      return res.status(200).json({
        status: "error",
        error: "Insufficient Privileges! Nice try tho! 😜",
      });
    }
    const { shipmentId } = req.query;
    if (!shipmentId) {
      return res.status(200).json({
        status: "error",
        error: "No shipmentId provided!",
      });
    }
    try {
      // todo: remove commission from previous agent if already calculated
      const previous = await Shipment.findOne({ _id: shipmentId });
      console.log(previous);
      if (previous.calculated) {
        await User.findByIdAndUpdate(previous.user, {
          $inc: {
            balance: -previous.rebate,
            wallet: -previous.rebate,
            totalKg: -previous.weight,
          },
        });
      }
      await Shipment.findByIdAndDelete(shipmentId);
      return res
        .status(200)
        .json({ status: "success", data: "shipment deleted successfully!" });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        error: "An error occurred!",
      });
    }
  }
};
export default handler;
