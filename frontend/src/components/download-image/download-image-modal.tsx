import React, { useRef, useState } from "react";
import {
  DownloadContainer,
  DownloadContent,
  DownloadContents,
  DownloadHeader,
  DownloadWrapper,
} from "../../pages/download-character/styles";
import { useViewport } from "../../hooks";
import { ButtonText } from "../atoms";
import { color } from "../../design";
import { useCharacterDownloader } from "../../context/character-image-provider";
import { useClickAwayListener } from "../../hooks/use-click-away-listener";

export interface DownloadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadImageModal: React.FC<DownloadProps> = ({ isOpen, onClose }) => {
  const { height } = useViewport();
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");
  const { download, downloadUrl, characterName, downloadOptions, setDownloadSize } = useCharacterDownloader();

  useClickAwayListener(modalRef, isOpen, onClose);
  const handleButtonClick = async (index: number) => {
    await download();
    setDownloadSize(downloadOptions[index].value);
    if (downloadUrl) downloadURI(downloadUrl, characterName);
    setSelectedMenuItem(downloadOptions[index].value);
  };

  return (
    <DownloadWrapper isOpen={isOpen} onClose={onClose}>
      <DownloadContainer ref={modalRef} height={height}>
        <DownloadHeader>Download Character</DownloadHeader>
        <DownloadContents>
          {downloadOptions.map((button, index) => (
            <DownloadContent
              key={index}
              onClick={() => {
                setSelectedMenuItem(button.value);
              }}
            >
              <ButtonText
                key={index}
                customColor={selectedMenuItem === button.value ? color.black : color.darkGrey}
                onClick={() => handleButtonClick(index)}
              >
                {button.label}
              </ButtonText>
            </DownloadContent>
          ))}
        </DownloadContents>
      </DownloadContainer>
    </DownloadWrapper>
  );
};

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
