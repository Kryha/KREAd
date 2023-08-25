import React from "react";
import styled from "@emotion/styled";
import { AgoricState } from "../../interfaces";

interface StatusIndicatorProps {
  statusObject: AgoricState["status"];
}

const StatusIndicatorContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatusText = styled.div<{ status: boolean }>`
  font-size: 12px;
  background: ${({ status }) => (status ? "green" : "red")};
  display: flex;
  -moz-box-pack: center;
  justify-content: center;
  -moz-box-align: center;
  align-items: center;
  height: 2rem;
  width: 10rem;
  border-style: solid;
  border-width: 2px;
  border-image: none 100% / 1 / 0 stretch;
  border-radius: 4px;
  border-color: hsl(218, 13%, 33%);
  cursor: pointer;
  font-weight: bold;
  user-select: none;
`;

interface StatusTextMap {
  [key: string]: string;
}
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ statusObject }) => {
  const statusTextMap: StatusTextMap = {
    walletConnected: "Wallet Connected",
    dappApproved: "Dapp Approved",
  };

  return (
    <StatusIndicatorContainer>
      {Object.entries(statusObject).map(([key, value]) =>
        key === "showApproveDappModal" ? null : (
          <Status key={key}>
            <StatusText status={value}>{statusTextMap[key]}</StatusText>
          </Status>
        )
      )}
    </StatusIndicatorContainer>
  );
};

const Status = styled.div`
  display: flex;
  margin-bottom: 4px;
`;
export default StatusIndicator;
