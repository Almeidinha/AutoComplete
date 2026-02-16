import { useEffect, useState } from "react";
import { fetchAddresses } from "../mocks/data";
import type { Address } from "../types";

const useAddressData = (query: string) => {
  const [data, setData] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setData([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);

      try {
        const results = await new Promise<Address[]>((resolve, reject) => {
          const onAbort = () =>
            reject(new DOMException("Aborted", "AbortError"));
          controller.signal.addEventListener("abort", onAbort, { once: true });

          fetchAddresses({ search: q, signal: controller.signal })
            .then(resolve)
            .finally(() =>
              controller.signal.removeEventListener("abort", onAbort),
            );
        });

        setData(results);
      } catch (error) {
        if ((error as Error).name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [query]);

  return { data, loading };
};

export default useAddressData;
