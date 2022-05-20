import styled from "styled-components";
import { color, fontWeight, margins } from "../../../design";

export const DetailSectionProgressBarWrap = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  gap: ${margins.medium};
  label {
    display: none;
  }
  progress[value] {
    color: ${color.black};
    border: 1px solid ${color.grey};
    border-radius: 2px;
    padding: 2px;
  }
  progress {
    color: ${color.black};
    border: 1px solid ${color.grey};
    border-radius: 2px;
    padding: 2px;
  }
  progress::-webkit-progress-bar {
    background-color: transparent;
  }
  progress::-webkit-progress-value {
    background-color: ${color.black};
  }
  progress::-moz-progress-bar {
    background-color: transparent;
  }
  span {
    font-weight: ${fontWeight.regular};
  }
`;
