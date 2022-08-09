import styled from "@emotion/styled";
import { SecondaryButton } from "../atoms";

export const ButtonInfoWrap = styled.div`
  display: inline-block;
  position: relative;
  top: -12px;
  ${SecondaryButton} {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    text-transform: none;
    padding: 6px 10px;
    border-radius: 50%;
  }
`;
