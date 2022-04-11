import User from "./../../backend/userModel";
import Shipment from "./../../backend/shipmentModel";
import Funds from "./../../backend/fundsModel";
const { startOfDay, endOfDay } = require("date-fns");
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  await connectToDatabase();
  const resetAll = async () => {
    const allAgents = await User.find({});

    allAgents.forEach(async (agent) => {
      console.log(
        `${agent.name}: ${agent.balance}, ${agent.wallet}, ${agent.totalKg}`
      );
      await User.findByIdAndUpdate(agent._id, {
        balance: 0,
        wallet: 0,
        totalKg: 0,
      });
    });
  };

  const calculateOne = async () => {
    const date1 = startOfDay(new Date("01/18/2020"));
    const date2 = startOfDay(new Date("02/02/2021"));

    const shipment = await Shipment.find({
      createdAt: {
        $gte: date1,
        $lte: date2,
      },
    });

    shipment.forEach(async (ship) => {
      let rate;
      if (ship.dollarRate) {
        rate = ship.dollarRate;
      } else {
        rate = 470;
      }
      const weight = ship.weight;
      const halfWeight = weight * 0.5;
      const dollar = halfWeight * rate;
      const naira = weight * 50;
      const total = Math.round(dollar + naira);

      const update = await User.findByIdAndUpdate(ship.user, {
        $inc: {
          wallet: total,
          totalKg: weight,
        },
      });
      console.log(
        `Updated  wallet with ${total}, Total: N${update.wallet || 0}`
      );
    });
  };

  const calculateSecond = async () => {
    const date1 = startOfDay(new Date("02/02/2021"));
    const date2 = endOfDay(new Date("02/28/2021"));

    const shipment = await Shipment.find({
      createdAt: {
        $gte: date1,
        $lte: date2,
      },
    });
    let rate;
    shipment.forEach(async (ship) => {
      if (ship.dollarRate) {
        rate = ship.dollarRate;
      } else {
        rate = 470;
      }
      const weight = ship.weight;
      const halfWeight = weight / 2;
      const dollar = halfWeight * rate;
      const naira = weight * 70;
      const total = Math.round(dollar + naira);
      const update = await User.findByIdAndUpdate(ship.user, {
        $inc: {
          totalKg: weight,
          wallet: total,
          balance: total,
        },
      });
      console.log(
        `Updated  wallet & balance with ${total}, Total: N${
          update.wallet || 0
        }, N:${update.balance || 0}`
      );
    });
  };

  const calculateThird = async () => {
    const date1 = startOfDay(new Date("03/01/2021"));
    const date2 = endOfDay(new Date("12/30/2021"));
    const shipment = await Shipment.find({
      createdAt: {
        $gte: date1,
        $lte: date2,
      },
    });
    let rate;
    shipment.forEach(async (ship, index) => {
      if (ship.dollarRate) {
        rate = ship.dollarRate;
      } else {
        rate = 470;
      }
      const weight = ship.weight;
      const halfWeight = weight / 2;
      const dollar = halfWeight * rate;
      const naira = weight * 100;
      const total = Math.round(dollar + naira);
      const update = await User.findByIdAndUpdate(ship.user, {
        $inc: {
          totalKg: weight,
          wallet: total,
          balance: total,
        },
      });
      console.log(
        `index ${index} Updated  wallet & balance with ${total}, Total: N${
          update.wallet || 0
        }, N:${update.balance || 0}`
      );
    });
  };

  const calculateFourth = async () => {
    const date1 = startOfDay(new Date("12/30/2021"));
    const date2 = endOfDay(new Date("04/06/2022"));
    const shipment = await Shipment.find({
      createdAt: {
        $gte: date1,
        $lte: date2,
      },
    });
    let rate;
    shipment.forEach(async (ship, index) => {
      if (ship.dollarRate) {
        rate = ship.dollarRate;
      } else {
        rate = 470;
      }
      const weight = ship.weight;
      const halfWeight = weight * 0.7;
      const dollar = halfWeight * rate;
      const naira = weight * 100;
      const total = Math.round(dollar + naira);

      const update = await User.findByIdAndUpdate(ship.user, {
        $inc: {
          totalKg: weight,
          wallet: total,
          balance: total,
        },
      });
      console.log(
        `index ${index} Updated  wallet & balance with ${total}, Total: N${
          update.wallet || 0
        }, N:${update.balance || 0 || 0}`
      );
    });
  };

  const deduct = async () => {
    const withdrawals = await Funds.find({});

    withdrawals.forEach(async (data) => {
      if (data.status === "Pending" || data.status === "Approved") {
        const update = await User.findByIdAndUpdate(data.user, {
          $inc: {
            balance: -data.amount,
          },
        });

        console.log(update);
      }
    });
  };

  const calculateAll = async () => {
    // await resetAll();
    await calculateOne();
    await calculateSecond();
    await calculateThird();
    await calculateFourth();
    await deduct();
  };

  calculateAll();

  res.status(200).json({ status: "success" });
};
export default handler;
