import styled, { css } from "styled-components";

export default styled.textarea`
  width: 100%;
  min-height: 130px;
  height: 100%;
  resize: vertical;
  padding: 10px;
  outline: none;
  border: 1px solid black;
  font-weight: 700;

  ${({ $edited }) => $edited && css`
    height: auto;
  `}
`;