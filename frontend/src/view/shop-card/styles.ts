import styled from "styled-components";

export const TitleText = styled.span`
  color: var(--star-dust);
  font-family: var(--font-family-aktiv_grotesk-regular);
  font-size: var(--font-size-xxxs);
  font-weight: 400;
  font-style: normal;
`;

export const OwnerText = styled.span`
  color: var(--licorice);
  font-family: var(--font-family-aktiv_grotesk-medium);
  font-size: var(--font-size-m2);
  font-weight: 500;
  font-style: normal;
`;

export const MediumText = styled.span`
  color: var(--licorice);
  font-family: var(--font-family-aktiv_grotesk-medium);
  font-size: var(--font-size-xxs);
  font-weight: 500;
  font-style: normal;
`;

export const Border = styled.span`
  border: 1px solid var(--celeste);
`;

export const Product = styled.div`
  ${Border}
  width: 402px;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  align-items: center;
  min-height: 485px;
  background-color: var(--k-white);
  border-radius: 24px;
`;

export const Image = styled.div`
  ${Border}
  display: flex;
  align-items: flex-start;
  min-width: 354px;
  border-radius: 24px;
  background-image: url(image-25.png);
  background-size: 100% 100%;
`;

export const Image1 = styled.div`
  width: 354px;
  height: 320px;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
`;

export const CharacterMasks = styled.img`
  width: 862px;
  height: 1215px;
  margin-left: -239px;
  margin-top: -667px;
`;

export const Content = styled.div`
  width: 354px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 93px;
`;

export const TitleWrapper = styled.div`
  width: 354px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 54px;
`;

export const TitleContainer = styled.h1`
  ${TitleText}
  width: 354px;
  min-height: 31px;
  letter-spacing: 0;
`;

export const OwnedByContainer = styled.div`
  ${TitleText}
  width: 354px;
  min-height: 15px;
  margin-top: 8px;
  letter-spacing: 0;
`;

export const Footer = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  min-width: 354px;
`;

export const Tag = styled.div`
  ${Border}
  height: 23px;
  display: flex;
  padding: 0 8px;
  align-items: center;
  min-width: 52px;
  background-color: var(--gallery);
  border-radius: 24px;
`;

export const Masks = styled.div`
  ${TitleText}
  min-height: 15px;
  min-width: 36px;
  letter-spacing: 0;
`;

export const RUN001 = styled.div`
  ${MediumText}
  min-height: 18px;
  margin-left: 242px;
  min-width: 60px;
  letter-spacing: 0;
`;
