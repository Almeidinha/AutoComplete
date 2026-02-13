import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AutoComplete from "../AutoComplete";

type Option = {
  id: number;
  label: string;
};

const buildLabel = (option: Option) => option.label;

const renderAutoComplete = (
  overrides?: Partial<React.ComponentProps<typeof AutoComplete<Option>>>,
) => {
  const props: React.ComponentProps<typeof AutoComplete<Option>> = {
    options: [],
    loading: false,
    placeholder: "Search",
    debounceDelay: 300,
    getOptionLabel: buildLabel,
    onSearch: vi.fn(),
    onSelect: vi.fn(),
    ...overrides,
  };

  const utils = render(<AutoComplete<Option> {...props} />);
  return {
    ...utils,
    props,
  };
};

describe("AutoComplete", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the input with placeholder", () => {
    renderAutoComplete();

    expect(screen.getByPlaceholderText("Search")).toHaveAttribute(
      "placeholder",
      "Search",
    );
  });

  it("opens and shows empty state on focus", async () => {
    renderAutoComplete();

    const input = screen.getByRole("combobox");
    await userEvent.click(input);

    expect(screen.getByText("Start typing...")).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("debounces search input", async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();

    renderAutoComplete({ onSearch, debounceDelay: 300 });

    expect(onSearch).toHaveBeenCalledWith("");

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Dublin" } });

    expect(onSearch).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledTimes(2);
    expect(onSearch).toHaveBeenLastCalledWith("Dublin");
  });

  it("shows loading state", async () => {
    renderAutoComplete({ loading: true });

    const input = screen.getByRole("combobox");
    await userEvent.click(input);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows no results message when search has no matches", async () => {
    renderAutoComplete({ options: [] });

    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Nowhere");

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("clears input and closes list when clear button is clicked", async () => {
    const onSearch = vi.fn();
    renderAutoComplete({ onSearch });

    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Dub");

    const clearButton = screen.getByRole("button", { name: /clear input/i });
    await userEvent.click(clearButton);

    expect(input).toHaveValue("");
    expect(onSearch).toHaveBeenCalledWith("");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects an option and closes the list", async () => {
    const onSelect = vi.fn();
    const options: Option[] = [
      { id: 1, label: "78 O'Connell Street" },
      { id: 2, label: "90 Blarney Lane" },
    ];

    renderAutoComplete({ options, onSelect });

    const input = screen.getByRole("combobox");
    await userEvent.click(input);

    const option = screen.getByText("78 O'Connell Street");
    await userEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith(options[0]);
    expect(input).toHaveValue("78 O'Connell Street");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("uses custom renderOption output", async () => {
    const options: Option[] = [{ id: 1, label: "Dublin" }];

    renderAutoComplete({
      options,
      renderOption: (option, query) => (
        <span>
          {option.label}:{query}
        </span>
      ),
    });

    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Du");

    expect(screen.getByText("Dublin:Du")).toBeInTheDocument();
  });
});
