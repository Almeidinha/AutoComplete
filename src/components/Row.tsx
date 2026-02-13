import type { ReactNode } from "react";
import styled from "styled-components";

const RowWrapper = styled.li<{ interactive: boolean }>`
  width: 100%;
  list-style: none;
  padding: 8px 4px;
  align-items: center;
  box-sizing: border-box;
  border-top: 1px solid #0a98df;
  ${(props) =>
    props.interactive &&
    `
    cursor: pointer;
    &:hover {
      background: #f0f8ff;
    }
    &:focus {
      outline: none;
      background: #f0f8ff;
    }
  `}
`;

type RowProps = {
  children: ReactNode;
  value?: string;
  onSelect?: (line1: string) => void;
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
      onKeyDown={(e: React.KeyboardEvent) => {
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
