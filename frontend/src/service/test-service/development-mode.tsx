import React, { useEffect, useRef, useState } from 'react';
import { ButtonText, disappear, fadeIn, fadeOut, PrimaryButton } from '../../components';
import styled from '@emotion/styled';
import { useViewport } from '../../hooks';
import { color, margins } from '../../design';
import { css } from '@emotion/react';
import { Diamond } from '../../components/price-in-ist/styles';
import { routes } from '../../navigation';
import { Link } from 'react-router-dom';
import { isDevelopmentMode } from '../../constants';
import { Tick } from '../../pages/buy/styles';
import { useDataMode } from '../../hooks/use-data-mode';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalContentProps {
  selected: boolean;
}

interface ViewProps {
  height: number;
}

interface DevProps {
  className?: string;
}

interface ButtonLink {
  text: string;
  route: string;
}

const buttonLinks: ButtonLink[] = [
  { text: 'Test Service UI', route: routes.test },
  { text: 'Home', route: routes.root },
  { text: 'Shop', route: routes.shop },
  { text: 'Inventory', route: routes.inventory },
  { text: 'Character', route: routes.character },
  { text: 'Create Character', route: routes.createCharacter },
  { text: 'Buy Item', route: routes.buyItem },
  { text: 'Sell Item', route: routes.sellItem },
  { text: 'Sell Character', route: routes.sellCharacter },
  { text: 'My Items', route: routes.items },
  { text: 'Onboarding', route: routes.onboarding },
  { text: 'Privacy', route: routes.privacy },
  { text: 'About', route: routes.about },


];

export const DevelopmentMode: React.FC<DevProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDevModeButtonClick = () => {
    setIsModalOpen(true);
    console.log("Dev Mode Button clicked");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  if (!isDevelopmentMode) {
    return null;
  }

  return (
    <DevModeContainer>
      <DevModeButtonContainer>
        <PrimaryButton onClick={handleDevModeButtonClick}>Dev Mode</PrimaryButton>
      </DevModeButtonContainer>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </DevModeContainer>


  );
};

const DevModeContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 200px;
  padding: 4px;
  z-index: 100;
  `;
const Modal: React.FC<ModalProps> =
  (
    {
      isOpen,
      onClose
    }
  ) => {

    const { height } = useViewport();
    const modalRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(-1);
    const { dataModeSelector} = useDataMode();

    const handleButtonClick = (index: number) => {
      setSelected(index);
    };

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, onClose]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <ModalContainer ref={modalRef} height={height}>
        <ModalHeader>
          {dataModeSelector}
        </ModalHeader>
        <ModalContents>
          {buttonLinks.map((button, index) => (
            <ModalContent
              selected={selected === index}
              key={index}
              onClick={() => {
                setSelected(-1);
              }}
            >
              <ButtonText
                key={index}
                customColor={selected === index ? color.black : color.darkGrey}
                onClick={() => handleButtonClick(index)}
              >
                <Link to={button.route}>{button.text}</Link>
              </ButtonText>
            </ModalContent>
          ))}
        </ModalContents>
      </ModalContainer>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div<ModalProps>`
  z-index: 1000;
  ${({ isOpen }): string => {
    return isOpen
      ? `
        position: absolute;
        margin-top: 14px;
        z-index: 1000;
        `
      : `
      display: none;
      `;
  }};
  ${({ isOpen }) =>
    isOpen === true
      ? css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.2s, 0.5s;
          animation-delay: 0s, 0.2s;
        `
      : css`
          animation: ${fadeOut};
          animation-duration: 0.5s;
        `};
` ;

const ModalContainer = styled.div<ViewProps>`
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${margins.medium};
  ${({ height }): string => `max-height: ${height - 250}px;`};

  &.open {
    opacity: 1;
    visibility: visible;
  }
  `;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${margins.medium};
  border-bottom: 1px solid ${color.grey};
  `;

const ModalContents = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  scrollbar-width: none;
  `;

const ModalContent = styled.div<ModalContentProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  margin: ${margins.small} 0px;
  cursor: pointer;
  color: ${color.darkGrey};
  gap: 16px;
  :hover {
    ${ButtonText} {
      color: ${color.black};
    }
    ${Diamond} {
      background: ${color.black};
    }
  }
  ${Tick} {
    ${({ selected }) => !selected && "display: none"}
  }
  ${Diamond} {
    align-self: center;
    margin-left: -25px;
    background: ${({ selected }) => (selected ? color.black : color.grey)};
  }
  `;

const DevModeButtonContainer = styled.div``;

