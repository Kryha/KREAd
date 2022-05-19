
import styled from "styled-components";
import { color, fontSize, fontWeight } from "../../design";

interface TextProps {
  customColor?: string;
}

export const Heading = styled.h1<TextProps>`
  font-family: Aktiv Grotesk Medium;
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

export const MenuText = styled.h2<TextProps>`
  font-family: Aktiv Grotesk Medium;
  font-weight: ${fontWeight.light};
  font-size: 32px;
  line-height: 41px;
  white-space: normal;
  word-break: keep-all;
  white-space: pre-wrap;
  font-weight: ${fontWeight.light};
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const Label = styled.p<TextProps>`
  font-family: Aktiv Grotesk Regular;
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
  font-family: Aktiv Grotesk Medium;
`;


export const MenuItemName = styled.h3<TextProps>`
  font-family: Aktiv Grotesk Medium;
  font-weight: ${fontWeight.light};
  font-size: ${fontSize.title};
  line-height: 22px;
    :first-letter {
    text-transform: capitalize;
  }
   ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const NavigationTitle = styled.h3<TextProps>`
  font-family: Aktiv Grotesk Medium;
  font-weight: ${fontWeight.light};
  font-size: ${fontSize.subTitle};
  line-height: 18px;
  ::first-letter {
    text-transform: capitalize;
  };
   ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const TitleText = styled.h3<TextProps>`
  font-family: Aktiv Grotesk Medium;
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
   ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const BodyText = styled.p<TextProps>`
  font-family: Aktiv Grotesk Regular;
  font-weight: 400;
  font-size: 24px;
  line-height: 31px;
    :first-letter {
    text-transform: capitalize;
  }
   ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const PageTitle = styled.h1<TextProps>`
  color: ${color.black};
  font-family: "Aktiv Grotesk Medium";
  font-weight: ${fontWeight.medium};
  font-size: 32px;
  line-height: 52px;
  :first-letter {
    text-transform: capitalize;
  }
`;

export const ButtonText = styled.h3<TextProps>`
  font-family: Aktiv Grotesk Medium;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  :first-letter {
    text-transform: capitalize;
  };
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;
