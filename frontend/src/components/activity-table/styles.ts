import styled from "styled-components";
import { color, margins } from "../../design";

export const ActivityTableWrap = styled.table`
  width: 100%;
  padding: ${margins.large};
  border-collapse: collapse;
  padding: ${margins.medium} ${margins.medium} ${margins.small};
  th,
  td {
    text-align: left;
  }
  thead {
    th {
      border-bottom: 1px solid ${color.darkGrey};
      text-transform: capitalize;
    }
  }
  tbody {
    tr {
      border-bottom: 1px solid ${color.darkGrey};
    }
  }
  tfoot {
    tr {
      border: none;
      padding: ${margins.medium};
      td {
      }
    }
  }
`;
