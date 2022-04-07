import TinyCollapse from "react-tiny-collapse";

const ChooseBatch = ({
  collapse,
  setCollapse,
  UpdateBatches,
  batches,
  selectedYear,
  selectedYearData,
  selectedMonth,
  selectedMonthData,
}) => {
  return (
    <form className="relative mt-[10px] flex flex-col justify-center space-y-[15px] rounded-xl border border-mainColor bg-white p-[15px] shadow-lg transition-all duration-700 ease-in-out">
      {collapse && (
        <svg
          onClick={() => setCollapse(!collapse)}
          className="absolute bottom-[10px] right-[15px] h-6 w-6 animate-bounce cursor-pointer text-mainColor"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {!collapse && (
        <svg
          onClick={() => setCollapse(!collapse)}
          className="absolute bottom-[10px] right-[15px] h-6 w-6 animate-bounce cursor-pointer text-mainColor"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}

      {!collapse ? (
        <p className="mt-[-15px] text-center transition-all duration-700 ease-in-out">
          Click arrow icon to choose batch
        </p>
      ) : (
        <p className="mt-[-15px] text-center transition-all duration-700  ease-in-out">
          Choose a batch to show shipments
        </p>
      )}

      <TinyCollapse isOpen={collapse}>
        <div className="flex flex-col space-y-[15px]">
          <div className="flex items-center">
            <label htmlFor="year" className="mr-[10px] min-w-[35%]">
              Select year:
            </label>
            <select
              name="year"
              onChange={(e) =>
                UpdateBatches({
                  year: e.target.value,
                })
              }
              className="rounded-lg bg-mainColor px-[8px] py-[5px] text-base text-white  caret-current focus:outline-none"
            >
              <option></option>
              {batches?.map((year, index) => {
                return (
                  <option key={index} value={year?.year}>
                    {year?.year}
                  </option>
                );
              })}
            </select>
          </div>

          {selectedYear && (
            <div className="flex items-center">
              <label htmlFor="month" className="mr-[10px] min-w-[35%]">
                Select month:
              </label>
              <select
                name="month"
                onChange={(e) =>
                  UpdateBatches({
                    month: e.target.value,
                  })
                }
                className="rounded-lg bg-mainColor px-[8px] py-[5px] text-base text-white  caret-current focus:outline-none"
              >
                <option></option>
                {selectedYearData?.map((month, index) => {
                  return (
                    <option key={index} value={month?.name}>
                      {month?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {selectedYear && selectedMonth && (
            <div className="flex items-center">
              <label htmlFor="batch" className="mr-[10px] min-w-[35%]">
                Select batch
              </label>
              <select
                name="batch"
                onChange={(e) => {
                  UpdateBatches({
                    start: e.target.value,
                  });
                }}
                className="rounded-lg bg-mainColor px-[8px] py-[5px]  text-base text-white  caret-current focus:outline-none"
              >
                <option></option>
                {selectedMonthData?.map((batch, index) => {
                  return (
                    <option key={index} value={batch?.startDate}>
                      Batch: {batch?.batch}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </TinyCollapse>
    </form>
  );
};

export default ChooseBatch;
