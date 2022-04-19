import Shipment from "./../../../backend/shipmentModel";
import all from "./../../../Mock.json";
const handler = async (req, res) => {
  try {
    // const ship = await Shipment.find({}).limit(231);

    // console.log(ship[0]);

    // ship.forEach(async (doc) => {
    //   const del = await Shipment.findByIdAndDelete(doc._id);
    //   console.log(del);
    // });

    // console.log(all.length);
    all.map(async (doc) => {
      const create = await Shipment.create({
        name: doc.name.toUpperCase(),
        destination: doc.destination.toUpperCase(),
        weight: doc.weight,
        carton: doc.carton,
        mobile: doc.mobile,
        shipCode: doc.shipCode,
        shipStatus:
          doc.shipstatus === "WAREHOUSE [LAGOS-NIGERIA]"
            ? "WAREHOUSE"
            : doc.shipstatus,
        action: doc.action,
        shipType: doc.shipType,
        paymentStatus: doc.paymentStatus,
        createdAt: doc.createdAt,
        dollarRate: doc.dollar_rate,
        customsRate: doc.customs_rate,
        freightRate: doc.freightRate,
        freightInDollars: doc.freight_$,
        freightTotal: doc.freight,
        customsTotal: doc.customs,
        amountDue: doc.amountDue,
        shipMode: doc.shipMode,
        locked: true,
        messageSent: true,
        calculated: true,
        user: doc.user._id,
      });
      console.log(create);
    });
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    status: "success",
  });
};

export default handler;
