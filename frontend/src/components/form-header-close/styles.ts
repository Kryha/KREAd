import styled from '@emotion/styled';
import { CloseIcon } from '../../assets';
import { margins } from '../../design';
import { HeaderHorizontalDivider } from '../atoms';

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0;
`;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const ReturnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0;
`;

export const ArrowContainer = styled.div`
  box-sizing: border-box;
  border-radius: ${margins.medium};
  margin-left: 46px;
`;

export const Close = styled(CloseIcon)`
  width: ${margins.small};
  height: ${margins.small};
  cursor: pointer;
`;
