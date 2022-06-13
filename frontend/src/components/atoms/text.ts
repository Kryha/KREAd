import styled from "@emotion/styled";
import { color, fontSize, fontWeight } from "../../design";

interface TextProps {
  customColor?: string;
}

export const Heading = styled.h1<TextProps>`
  font-family: aktiv-grotesk;
  font-size: 40px;
  line-height: 44px;
  white-space: normal;
  word-break: keep-all;
  white-space: pre-wrap;
  font-weight: ${fontWeight.light};
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const MenuText = styled.h1<TextProps>`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.medium};
  font-size: 32px;
  line-height: 41px;
  white-space: normal;
  word-break: keep-all;
  white-space: pre-wrap;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const Label = styled.p<TextProps>`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.light};
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.04em;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.darkGrey};`};
`;

export const BoldLabel = styled(Label)`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.medium};
`;

export const MenuItemName = styled.h3<TextProps>`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.medium};
  font-size: ${fontSize.title};
  line-height: 22px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const NavigationTitle = styled.h3<TextProps>`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.medium};
  font-size: ${fontSize.subTitle};
  line-height: 18px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const TitleText = styled.h3<TextProps>`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const BodyText = styled.p<TextProps>`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const PageTitle = styled.h1<TextProps>`
  color: ${color.black};
  font-family: "aktiv-grotesk";
  font-weight: ${fontWeight.medium};
  font-size: 32px;
  line-height: 52px;
  :first-letter {
    text-transform: capitalize;
  }
`;

export const ButtonText = styled.h3<TextProps>`
  font-family: aktiv-grotesk;
  font-weight: ${fontWeight.medium};
  font-size: 12px;
  line-height: 15px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const SectionHeader = styled.h1`
  font-size: 32px;
  font-weight: ${fontWeight.regular};
  line-hight: 40px;
`;

export const FormText = styled(BodyText)`
  font-size: 14px;
  line-height: 18px;
`;
