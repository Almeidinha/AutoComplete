import type { Address } from "../types";

const sampleAddresses: Address[] = [
  { id: 1, line1: "78 O'Connell Street", town: "Dublin", eircode: "Y23A482" },
  { id: 2, line1: "90 Blarney Lane", town: "Cork", eircode: "V57B193" },
  { id: 3, line1: "87 Quay Street", town: "Galway", eircode: "D04C729" },
  { id: 4, line1: "61 Thomas Street", town: "Limerick", eircode: "V81D204" },
  { id: 5, line1: "82 The Mall", town: "Waterford", eircode: "Y66F381" },
  { id: 6, line1: "74 High Street", town: "Kilkenny", eircode: "D12G582" },
  { id: 7, line1: "910 Teeling Street", town: "Sligo", eircode: "V39H274" },
  { id: 8, line1: "98 West Street", town: "Drogheda", eircode: "Y25J183" },
  { id: 9, line1: "10 Rowe Street", town: "Wexford", eircode: "D88K492" },
  { id: 10, line1: "27 Abbey Street", town: "Limerick", eircode: "V73L205" },
  { id: 11, line1: "5 Kimmage Road Lower", town: "Dublin", eircode: "Y19M384" },
  { id: 12, line1: "5 Kimmage Grove", town: "Dublin", eircode: "D45N781" },
  { id: 13, line1: "5 Kimmage Court", town: "Dublin", eircode: "V62P193" },
  { id: 14, line1: "23 Kimmage Manor Way", town: "Tralee", eircode: "Y31Q284" },
  {
    id: 15,
    line1: "21 Clanbrass Street",
    town: "Waterford",
    eircode: "D54R185",
  },
  { id: 16, line1: "66 North Street", town: "Waterford", eircode: "V28S492" },
  { id: 17, line1: "28 Church Street", town: "Waterford", eircode: "Y77T381" },
  { id: 18, line1: "39 Pearse Street", town: "Dublin", eircode: "D36U284" },
  {
    id: 19,
    line1: "60 Lower Main Street",
    town: "Limerick",
    eircode: "V41V193",
  },
  { id: 20, line1: "38 Dublin Street", town: "Dublin", eircode: "Y52W384" },
  { id: 21, line1: "8 South Main Street", town: "Dublin", eircode: "D63X781" },
  { id: 22, line1: "63 Lyster Square", town: "Portlaoise", eircode: "V84Y205" },
  { id: 23, line1: "11 Castle Street", town: "Limerick", eircode: "Y95Z492" },
  { id: 24, line1: "36 Bridge Street", town: "Dublin", eircode: "D17A381" },
  { id: 25, line1: "29 Gladstone Street", town: "Clonmel", eircode: "V26B284" },
  { id: 26, line1: "20 Lower Main Street", town: "Arklow", eircode: "Y38C185" },
  { id: 27, line1: "10 Dublin Street", town: "Dublin", eircode: "D49D492" },
  { id: 28, line1: "31 Patrick Street", town: "Dublin", eircode: "V57E381" },
  { id: 29, line1: "58 Abbey Street", town: "Wicklow", eircode: "Y60F284" },
  { id: 30, line1: "46 Pearse Street", town: "Ballina", eircode: "D71G185" },
];

const GET_ADDRESS_TIMEOUT = 1000;

export const fetchAddresses = (options: {
  search: string;
  signal?: AbortSignal;
}): Promise<Address[]> => {
  const { search, signal } = options;
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(
        sampleAddresses.filter((address) => {
          for (const field of ["line1", "town", "eircode"] as const) {
            if (address[field].toLowerCase().includes(search.toLowerCase())) {
              return true;
            }
          }
          return false;
        }),
      );
    }, GET_ADDRESS_TIMEOUT);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
      });
    }
  });
};
