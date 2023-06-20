import styled from "@emotion/styled";
import { SecondaryButton } from "../atoms";

export const ButtonInfoWrap = styled.div`
  display: inline-block;
  position: absolute;
  right: 0;
  margin-right: 20px;
  margin-bottom: 20px;
  ${SecondaryButton} {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    text-transform: none;
    padding: 6px 10px;
    border-radius: 50%;
  }
`;
