import "./App.css";
import AutoComplete from "./components/AutoComplete";
import useAddressData from "./hooks/useAddressData";
import type { Address } from "./types";
import { useState } from "react";
import highlightMatch from "./utils/highlightMatch";
function App() {
  const [query, setQuery] = useState("");

  const { data, loading } = useAddressData(query);

  const buildLabel = (address: Address) =>
    `${address.line1}, ${address.town}, ${address.eircode}`;

  return (
    <AutoComplete<Address>
      options={data}
      loading={loading}
      placeholder="Search for an address..."
      onSearch={setQuery}
      getOptionLabel={buildLabel}
      onSelect={(address) => console.log(address)}
      renderOption={(option, query) =>
        highlightMatch(buildLabel(option), query)
      }
    />
  );
}

export default App;
