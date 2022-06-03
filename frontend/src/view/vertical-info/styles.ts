import styled from "styled-components";

export const Info = styled.div`
  width: 15px;
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  align-items: center;
  min-height: 95px;
`;
export const NumberInfo = styled.span`
  color: var(--licorice);
  font-family: var(--font-family-aktiv_grotesk-medium);
  font-size: var(--font-size-xxxs);
  font-weight: 500;
  font-style: normal;
`;

export const GeneralInfo = styled.span`
  color: var(--star-dust);
  font-family: var(--font-family-aktiv_grotesk-medium);
  font-size: var(--font-size-xxxs);
  font-weight: 500;
  font-style: normal;
`;

export const Text = styled.div`
  ${NumberInfo}
  min-height: 15px;
  margin-top: 10px;
  margin-left: 0;
  min-width: 46px;
  transform: rotate(-90deg);
  letter-spacing: 0.48px;
`;

export const Line = styled.div`
  width: 1px;
  height: 16px;
  margin-top: 24px;
  margin-left: 1px;
  border: 1px solid #A1A1A1;
  transform: rotate(-90deg);
`;
export const InfoContainer = styled.div`
  ${GeneralInfo}
  min-height: 15px;
  margin-top: 5px;
  min-width: 9px;
  transform: rotate(-90deg);
  letter-spacing: 0.48px;
`;
