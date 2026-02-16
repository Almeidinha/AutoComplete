import type { ReactNode } from "react";
import styled from "styled-components";

const RowWrapper = styled.li<{ interactive: boolean }>`
  width: 100%;
  list-style: none;
  padding: 8px 4px;
  align-items: center;
  box-sizing: border-box;
  ${(props) =>
    props.interactive &&
    `
    cursor: pointer;
    &:hover {
      background: #F4F4F4;
    }
    &:focus {
      outline: none;
      background: #F4F4F4;
    }
  `}
`;

type RowProps = {
  children: ReactNode;
  value?: string;
  onSelect?: (value: string) => void;
};

const Row = ({ children, value, onSelect }: RowProps) => {
  const handleSelect = () => {
    onSelect?.(value || "");
  };

  return (
    <RowWrapper
      interactive={!!onSelect}
      role="option"
      tabIndex={0}
      onClick={handleSelect}
      onMouseDown={(e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        handleSelect();
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => {
        if (e.key === "Enter") {
          handleSelect();
        }
      }}
    >
      {children}
    </RowWrapper>
  );
};

export default Row;
