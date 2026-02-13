import { useEffect, useState } from "react";
import { fetchAddresses } from "../mocks/data";
import type { Address } from "../types";

const useAddressData = (query: string) => {
  const [data, setData] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setData([]);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        const results = await fetchAddresses({
          search: query,
          signal: controller.signal,
        });
        setData(results);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [query]);

  return {
    data,
    loading,
  };
};

export default useAddressData;
