import { useState } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { MultiSelect } from "react-multi-select-component";

const RequestAgent = () => {
  const alert = useAlert();
  const [requestData, setRequestData] = useState({
    name: "",
    mobile: "",
    services: [],
    tempServices: [],
    terms: false,
  });
  const [terms, setTerms] = useState(false);
  const services = [
    { label: "Female Wears (Adult)", value: "femaleWearsAdult" },
    { label: "Children Wears", value: "childrenWears" },
    { label: "Bags & Shoes", value: "bags&shoes" },
    { label: "Mens Wears (Adult)", value: "maleWearsAdult" },
    { label: "Furniture", value: "furniture" },
    { label: "Not listed", value: "other" },
  ];

  const handleAgentRequest = async () => {
    const Joi = (await import("joi")).default;

    //   input validation
    const myCustomJoi = Joi.extend(require("joi-phone-number"));

    const schema = Joi.object({
      name: Joi.string().required().max(28),
      PhoneNumber: myCustomJoi
        .string()
        .phoneNumber()
        .required()
        .max(13)
        .regex(/^\d+$/),
      services: Joi.required(),
    });

    const { error, value } = await schema.validate({
      PhoneNumber: requestData.mobile,
      name: requestData.name,
      services: requestData.services,
    });
    console.log(first);
    if (error) {
      alert.show(
        <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
          {error.details[0].message.includes("must be a string")
            ? "Please fill all fields"
            : value?.mobile?.length > 14
            ? "mobile number is too long"
            : error.details[0].message}
        </div>,
        {
          type: "error",
        }
      );
    } else {
      const res = await axios.post("/api/requestAgent", requestData);

      if (res.data.status === "error") {
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            {res.data.error}
          </div>,
          {
            type: "error",
          }
        );
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            {res.data.error}
          </div>,
          {
            type: "error",
          }
        );
      } else {
        alert.show(
          <div
            className="mt-[60px] text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            Request successful!, kindly check your whatsapp for updates!!!
          </div>,
          {
            type: "error",
          }
        );
      }
    }
  };

  return (
    <div className="flex w-full justify-between bg-mainColor px-[100px] pb-[150px] pt-[100px] text-white">
      <div className="mt-[120px] w-[50%]">
        <p className="italic">Need a seasoned personal shopper?</p>
        <p className="my-[5px] font-heading text-3xl">
          Request for an experienced & trusted
        </p>
        <p className="my-[5px] font-heading text-3xl">
          Forte-Bridge procurement agent
        </p>
      </div>
      <div className="mt-[70px] mr-[100px] w-[40%] rounded-lg bg-gray-100 px-[20px] py-[40px]">
        <p className="mb-[10px] text-center text-xl text-black">
          Fill out this form to request for an agent
        </p>
        <form className="flex flex-col space-y-[20px]">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-[5px] text-black">
              Your name
            </label>
            <input
              onChange={(e) =>
                setRequestData({ ...requestData, name: e.target.value })
              }
              className="min-w-0 p-2 uppercase border-0 rounded-lg bg-black/70 text-mainColor focus:outline-0"
              type="text"
              name="name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-[5px] text-black">
              Your Whatsapp number
            </label>
            <input
              onChange={(e) =>
                setRequestData({
                  ...requestData,
                  mobile: e.target.value.replace(" ", ""),
                })
              }
              className="min-w-0 p-2 uppercase border-0 rounded-lg bg-black/70 text-mainColor focus:outline-0"
              type="text"
              name="name"
              placeholder="e.g +23480180180156"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-[5px] text-black">
              Choose all the services you need
            </label>
            <MultiSelect
              options={services}
              value={requestData.tempServices}
              onChange={(d) =>
                setRequestData({
                  ...requestData,
                  services: [d.map((e) => e.value)],
                  tempServices: d,
                })
              }
              labelledBy="Choose all that apply"
              shouldToggleOnHover={true}
              className="text-black "
            />
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              name="terms"
              onChange={(e) =>
                setRequestData({ ...requestData, terms: !requestData.terms })
              }
            />
            <span className="text-black">
              I have read and agreed to the{" "}
              <span
                className="text-black underline cursor-pointer underline-offset-2"
                onClick={() => setTerms(!terms)}
              >
                terms and conditions
              </span>{" "}
              of this application
            </span>
          </div>
          {terms && (
            <div className="text-black">
              <p>
                Read the following terms and conditions binding this application
              </p>
              <p>
                1. Kindly note that if we give you an agent from forte-bridge,
                you are not allowed to instruct the agent to send your goods
                through any other cargo in Turkey that offers the same or
                similar services as Forte-Bridge Global Logistics unless a
                waiver has been given to you by the management
              </p>
              <p>
                2. To mitigate the risk fraud, you should notify the management
                of forte-bridge of dealing and transactions with the agent of
                any deals deal worth more than 1 million naira or $2000 or
                proceed with trust at your own risk.
              </p>
              <p>
                3.If any of our agents takes your goods to another cargo, that
                means that they no longer work with us, hence conducting
                business with such individuals is at your own risk! notify us
                immediately before you continue to transact with such agent!
              </p>
            </div>
          )}
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleAgentRequest();
            }}
            className="mx-auto mt-[20px] mb-[10px] w-fit rounded-lg bg-black py-[10px] px-[20px] text-white "
          >
            Submit request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestAgent;
