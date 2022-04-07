import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import axios from "axios";

const useSearch = (setShipment, fetchShipment, router) => {
  const alert = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("shipment");
  const [path, setPath] = useState("name");

  const handleSearch = async () => {
    setIsLoading(true);
    const res = await axios.post("/api/search", {
      query,
      path,
      searchType,
    });
    if (res.data.status === "success") {
      setShipment(res.data.data);
    } else {
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
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (query.length <= 1) {
      if (router?.query?.agent) {
        return;
      } else fetchShipment();
    } else {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return {
    isLoading,
    query,
    setQuery,
    searchType,
    setSearchType,
    path,
    setPath,
  };
};

export default useSearch;
