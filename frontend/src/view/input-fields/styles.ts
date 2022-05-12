// TODO: replace @mui components
// import { Box, InputLabel, Select } from "@mui/material";
import styled from "styled-components";
import { SelectArrowIcon } from "../../assets";

import { color, margins } from "../../design";

export const StyledSelect = styled.select`
  && {
    border: 0.5px solid ${color.grey};
    box-sizing: border-box;
    border-radius: ${margins.medium};

    & > div {
      padding: 8px 8px 8px 16px;
    }
  }
  & svg {
    color: ${color.black};
  }
`;

export const Label = styled.label`
  && {
    margin-top: -8px;
    padding-left: 16px;
    :first-letter {
      text-transform: capitalize;
    }
    color: ${color.black};
    font-family: Aktiv Grotesk Regular;
  }
`;

export const FormBox = styled.div`
  width: 140px;
`;

export const SelectArrow = styled(SelectArrowIcon)`
  margin-top: -5px;
`;
