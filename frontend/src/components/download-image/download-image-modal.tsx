import React, { useCallback, useRef, useState } from "react";
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
import { text } from "../../assets";
import { FloatingSpinner } from "../content-loader/styles";

export interface DownloadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadImageModal: React.FC<DownloadProps> = ({ isOpen, onClose }) => {
  const { height } = useViewport();
  const modalRef = useRef<HTMLDivElement>(null);
  const { download, downloadSize, downloadOptions, setDownloadSize } = useCharacterDownloader();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useClickAwayListener(modalRef, isOpen, onClose);

  const handleButtonClick = useCallback(
    async (index: number) => {
      const selectedDownloadSize = downloadOptions[index].value;
      try {
        setIsLoading(true);
        await download(selectedDownloadSize);
        setIsLoading(false);
        console.info("Successfully downloaded character image");
      } catch (error) {
        console.error(text.error.downloadFailed, error);
      }
      onClose();
    },
    [download, downloadOptions, onClose]
  );

  return (
    <DownloadWrapper isOpen={isOpen} onClose={onClose}>
      <DownloadContainer ref={modalRef} height={height}>
        <DownloadHeader>Download Character</DownloadHeader>
        <DownloadContents>
          {isLoading ? <FloatingSpinner /> : null}
          {downloadOptions.map((button, index) => (
            <DownloadContent
              key={index}
              onClick={() => {
                setDownloadSize(button.value);
              }}
            >
              <ButtonText
                key={index}
                customColor={downloadSize === button.value ? color.black : color.darkGrey}
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
