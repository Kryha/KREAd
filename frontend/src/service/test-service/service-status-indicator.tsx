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
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatusDot = styled.div<{ status: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 4px;
  background: ${({ status }) => (status ? "green" : "red")};
`;

const StatusText = styled.span`
  margin-left: 4px;
`;

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ statusObject }) => {
  return (
    <StatusIndicatorContainer>
      {Object.entries(statusObject).map(([key, value]) => (
        <div key={key}>
          <StatusDot status={value} />
          <StatusText>{key}</StatusText>
        </div>
      ))}
    </StatusIndicatorContainer>
  );
};

export default StatusIndicator;
