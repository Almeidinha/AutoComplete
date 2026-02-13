import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useAddressData from "../useAddressData";
import { fetchAddresses } from "../../mocks/data";
import type { Address } from "../../types";

vi.mock("../../mocks/data", () => ({
  fetchAddresses: vi.fn(),
}));

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const createDeferred = <T,>(): Deferred<T> => {
  let resolve: (value: T) => void = () => undefined;
  let reject: (reason?: unknown) => void = () => undefined;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

describe("useAddressData", () => {
  it("returns empty state for empty query", () => {
    const { result } = renderHook(() => useAddressData(""));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(fetchAddresses).not.toHaveBeenCalled();
  });

  it("loads data when query is provided", async () => {
    const mockedFetch = vi.mocked(fetchAddresses);
    const deferred = createDeferred<Address[]>();
    const sample: Address[] = [
      {
        id: 1,
        line1: "78 O'Connell Street",
        town: "Dublin",
        eircode: "Y23A482",
      },
    ];

    mockedFetch.mockReturnValueOnce(deferred.promise);

    const { result } = renderHook(() => useAddressData("Dub"));

    await waitFor(() => expect(result.current.loading).toBe(true));

    expect(fetchAddresses).toHaveBeenCalledWith(
      expect.objectContaining({ search: "Dub" }),
    );

    const args = mockedFetch.mock.calls[0][0];
    expect(args.signal).toBeInstanceOf(AbortSignal);

    await act(async () => {
      deferred.resolve(sample);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(sample);
  });
});
