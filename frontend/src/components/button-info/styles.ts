import styled from "styled-components";
import { SecondaryButton } from "../atoms";

export const ButtonInfoWrap = styled.div`
  display: inline-block;
  vertical-align: text-bottom;
  ${SecondaryButton} {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    text-transform: none;
    padding: 6px 10px;
    border-radius: 50%;
  }
`;
