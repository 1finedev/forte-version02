import shipments from "./../../../public/shipments.json";
import Shipment from "./../../../backend/shipmentModel";

const handler = async (req, res) => {
  try {
    shipments.forEach(async (ship, i) => {
      let mobileNo;
      if (ship.mobile) {
        const m = ship.mobile.toString();
        mobileNo = m.length > 10 ? m : `234${m}`;
      }
      const shipment = await Shipment.create({
        name: ship.name.toUpperCase(),
        destination: ship.destination,
        weight: ship.weight,
        carton: ship.carton,
        mobile: ship.mobile ? mobileNo : undefined,
        user: ship.user.$oid,
        shipCode: ship.shipcode,
        shipStatus:
          ship.shipstatus === "WAREHOUSE [LAGOS-NIGERIA]"
            ? "WAREHOUSE"
            : ship.shipstatus,
        action: ship.action,
        shipType: ship.shipType,
        paymentStatus: ship.paymentStatus,
        dollarRate: ship.dollar_rate,
        customsRate: ship.customs_rate,
        freightRate: ship.freight_rate,
        freightInDollars: ship.freight_$,
        freightTotal: ship.freight,
        customsTotal: ship.customs,
        amountDue: ship.amountDue,
        shipMode: ship.shipMode,
        discount: ship.discount,
        locked: true,
        messageSent: true,
        calculated: true,
        createdAt: ship.createdAt.$date,
      });
      console.log(ship.name, i);
    });
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    status: "success",
    data: shipments.length,
  });
};

export default handler;
