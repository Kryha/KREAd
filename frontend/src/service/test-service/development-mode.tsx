import { isDevelopmentMode } from "../../constants";
import { routes } from "../../navigation";
import React, { useEffect, useRef, useState } from "react";
import { ButtonText, disappear, fadeIn, fadeOut, SecondaryButton } from "../../components";
import styled from "@emotion/styled";
import { useViewport } from "../../hooks";
import { Link, useLocation } from "react-router-dom";
import { color, fontSize, margins } from "../../design";
import { css } from "@emotion/react";
import { Diamond } from "../../components/price-in-ist/styles";
import { Tick } from "../../pages/buy/styles";
import { DevIcon } from "../../assets";

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

interface DevIconProps {
  color: string;
}

const buttonLinks: ButtonLink[] = [
  { text: "Test Service UI", route: routes.test },
  { text: "Home", route: routes.root },
  { text: "Shop", route: routes.shop },
  { text: "Inventory", route: routes.inventory },
  { text: "Character", route: routes.character },
  { text: "Create Character", route: routes.createCharacter },
  { text: "Download Character", route: routes.downloadCharacter },
  { text: "Buy Item", route: routes.buyItem },
  { text: "Sell Item", route: routes.sellItem },
  { text: "Sell Character", route: routes.sellCharacter },
  { text: "My Items", route: routes.items },
  { text: "Onboarding", route: routes.onboarding },
  { text: "Privacy", route: routes.privacy },
  { text: "About", route: routes.about },
];

export const DevelopmentMode: React.FC<DevProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const handleDevModeButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!isDevelopmentMode) {
    return null;
  }

  return (
    <DevModeContainer>
      <DevModeButton onClick={handleDevModeButtonClick}>
        <Dev color={location.pathname === routes.test ? "white" : "black"} />
      </DevModeButton>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </DevModeContainer>
  );
};

const DevModeContainer = styled.div`
  position: relative;
  padding: 4px;
  z-index: 100;
`;
const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { height } = useViewport();
  const modalRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(-1);

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
        <ModalHeader></ModalHeader>
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
  ${({ isOpen }): string => {
    return isOpen
      ? `
        position: absolute;
        margin-top: 14px;
        right: 40px
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
`;

const ModalContainer = styled.div<ViewProps>`
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  box-sizing: border-box;
  opacity: 1;
  display: flex;
  flex-direction: column;
  padding: ${margins.medium};
  width: 250px;
  ${({ height }): string => `max-height: ${height - 250}px;`};

  &.open {
    opacity: 1;
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

export const DevModeButton = styled(SecondaryButton)`
  padding: 19px 3px;
  border-radius: 50%;

  position: relative;
  /* Add styles for the pop-up */
  &::before {
    content: "Dev Mode";
    position: absolute;
    bottom: -2rem; /* Adjust the vertical position as needed */
    left: 50%;
    transform: translateX(-50%);
    background: ${color.black};
    color: ${color.white};
    padding: 0.25rem 0.5rem;
    font-size: ${fontSize.extraSmall};
    border-radius: ${margins.mini};
    opacity: 0;
    width: max-content;
    transition: opacity 0.3s ease-in-out;
  }

  /* Show the pop-up on hover */
  &:hover::before {
    opacity: 1;
  }
`;

export const Dev = styled(DevIcon)<DevIconProps>`
  svg {
    height: 20px;
    width: 20px;
    margin: 0;
  }
  path {
    fill: ${({ color }) => color};
  }
`;
