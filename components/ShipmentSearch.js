const ShipmentSearch = ({ query, setQuery }) => {
  return (
    <div className="my-[30px] text-center text-mainColor">
      <input
        onInput={(e) => setQuery(e.target.value)}
        value={query}
        type="text"
        className="w-full rounded-full border-2 border-mainColor bg-white p-[10px] text-center placeholder-gray-900 shadow-xl outline-0 ring-0 focus:outline-none"
        name="search"
        placeholder="Search a shipment"
      />
    </div>
  );
};

export default ShipmentSearch;
