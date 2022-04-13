import Shipment from "./../../../backend/shipmentModel";

const handler = async (req, res) => {
  try {
    const all = await Shipment.find({}, { _id: 1 })
      .limit(23)
      .sort({ createdAt: -1 });

    console.log(all.length);
    all.map(async (doc) => {
      const del = await Shipment.findByIdAndDelete(doc._id);
      console.log(del);
    });
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    status: "success",
  });
};

export default handler;
