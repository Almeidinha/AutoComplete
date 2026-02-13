import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import useClickAway from "../hooks/useClickAway";
import useDebounce from "../hooks/useDebounce";
import Row from "./Row";

type AutoCompleteProps<T> = {
  options: T[];
  loading?: boolean;
  placeholder?: string;
  debounceDelay?: number;
  getOptionLabel: (option: T) => string;
  onSearch: (value: string) => void;
  onSelect: (option: T) => void;
  renderOption?: (option: T, query: string) => React.ReactNode;
};

const ListWrapper = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const AutoInput = styled.input`
  width: 100%;
  border: none;
  color: #333;
  padding: 12px;
  padding-right: 32px;
  background: transparent;
  box-sizing: border-box;

  &:focus-visible {
    outline: none;
  }
`;

const Component = styled.div<{ focused?: boolean }>`
  width: 400px;
  border-radius: 4px;
  border: ${(props) => (props.focused ? "2px" : "1px")} solid #0a98df;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  line-height: 1;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const AutoComplete = <T,>({
  options,
  loading,
  placeholder = "Search for an Address or Eircode",
  debounceDelay = 400,
  getOptionLabel,
  onSearch,
  onSelect,
  renderOption,
}: AutoCompleteProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const debouncedValue = useDebounce(inputValue.trim(), debounceDelay);

  useClickAway(wrapperRef, () => setOpen(false));

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <Component ref={wrapperRef} focused={open}>
      <InputWrapper>
        <AutoInput
          type="text"
          role="combobox"
          name="autocomplete_input"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
        />

        {inputValue && (
          <ClearButton
            type="button"
            onClick={() => {
              setInputValue("");
              onSearch(""); // trigger empty search
              setOpen(false);
            }}
            aria-label="Clear input"
          >
            x
          </ClearButton>
        )}
      </InputWrapper>

      {open && (
        <>
          {!inputValue && !loading && options.length === 0 && (
            <Row>Start typing...</Row>
          )}

          {loading && <Row>Loading...</Row>}

          {!loading && inputValue && options.length === 0 && (
            <Row>No results found</Row>
          )}

          <ListWrapper role="listbox">
            {options.map((option, index) => {
              const label = getOptionLabel(option);
              return (
                <Row
                  key={index}
                  onSelect={() => {
                    onSelect(option);
                    setInputValue(label);
                    setOpen(false);
                  }}
                >
                  {renderOption ? renderOption(option, inputValue) : label}
                </Row>
              );
            })}
          </ListWrapper>
        </>
      )}
    </Component>
  );
};

export default AutoComplete;
