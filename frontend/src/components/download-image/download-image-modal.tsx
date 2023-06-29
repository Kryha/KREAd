import React, { useEffect, useRef, useState } from "react";
import {
  DownloadContainer,
  DownloadContent,
  DownloadContents,
  DownloadProps,
  DownloadWrapper,
} from "../../pages/download-character/styles";
import { useViewport } from "../../hooks";
import { downloadOptions, useImageDownloader } from "../../hooks/use-image-downloader";

import { ButtonText } from "../atoms";
import { color } from "../../design";

export const DownloadImageModal: React.FC<DownloadProps> = ({ isOpen, onClose }) => {
  const { height } = useViewport();
  const modalRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(-1);
  const { setDownloadSize, drawCharacter } = useImageDownloader();

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleButtonClick = async (index: number) => {
    setDownloadSize(downloadOptions[index].value);
    const imageSrc = (await drawCharacter()) as string;
    if (imageSrc) downloadURI(imageSrc, "character.png");
    setSelected(index);
  };

  //TODO: use click-away listener hook
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
    <DownloadWrapper isOpen={isOpen} onClose={onClose}>
      <DownloadContainer ref={modalRef} height={height}>
        <DownloadContents>
          {downloadOptions.map((button, index) => (
            <DownloadContent
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
                {button.label}
              </ButtonText>
            </DownloadContent>
          ))}
        </DownloadContents>
      </DownloadContainer>
    </DownloadWrapper>
  );
};
