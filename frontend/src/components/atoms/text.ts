import styled from "@emotion/styled";
import { breakpoints, color, fontSize, fontWeight } from "../../design";

interface TextProps {
  customColor?: string;
}

export const Heading = styled.h1<TextProps>`
  font-size: 40px;
  line-height: 44px;
  word-break: keep-all;
  white-space: pre-wrap;
  font-weight: ${fontWeight.light};
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const MenuText = styled.h1<TextProps>`
  font-weight: ${fontWeight.medium};
  font-size: 32px;
  line-height: 41px;
  word-break: keep-all;
  white-space: pre-wrap;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const Label = styled.p<TextProps>`
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
  font-weight: ${fontWeight.medium};
`;

export const LevelBoldLabel = styled(Label)`
  font-weight: ${fontWeight.medium};
  font-size: ${fontSize.medium};
`;

export const MenuItemName = styled.h3<TextProps>`
  font-weight: ${fontWeight.medium};
  font-size: ${fontSize.title};
  line-height: 22px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const NavigationTitle = styled.h3<TextProps>`
  font-weight: ${fontWeight.medium};
  font-size: 16px;
  line-height: 18px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};

  @media screen and (max-width: 768px) {
    font-size: ${fontSize.subTitle};
  }
`;

export const TitleText = styled.h3<TextProps>`
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  white-space: pre-line;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};

  @media screen and (max-width: ${breakpoints.tablet}) {
    font-size: 16px;
  }
`;

export const BodyText = styled.p<TextProps>`
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
  font-weight: ${fontWeight.medium};
  font-size: 32px;
  line-height: 52px;
  :first-letter {
    text-transform: capitalize;
  }
`;

export const PageSubTitle = styled.h1<TextProps>`
  color: ${color.black};
  font-weight: ${fontWeight.medium};
  font-size: 24px;
  line-height: 12px;
  color: ${color.darkGrey};
  :first-letter {
    text-transform: capitalize;
  }
`;

export const ButtonText = styled.h3<TextProps>`
  font-weight: ${fontWeight.medium};
  font-size: 14px;
  line-height: 15px;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;

export const SectionHeader = styled.h1`
  font-size: 32px;
  font-weight: ${fontWeight.regular};
  line-height: 40px;
  :first-letter {
    text-transform: capitalize;
  }
  min-width: 200px;
`;

export const FormText = styled(BodyText)`
  font-size: 14px;
  line-height: 18px;
`;

export const FormTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 16px;
`;

export const FormTableRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;
