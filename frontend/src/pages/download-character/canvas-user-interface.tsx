import React, { FC, useState } from "react";
import {
  ControlAreaBottom,
  ControlAreaTop,
  ControlAreaWrapper,
  ZoomActions,
  ZoomContainer,
  ZoomIn,
  ZoomInButton,
  ZoomOut,
  ZoomOutButton,
  ZoomResetButton,
} from "./styles";
import { PrimaryButton } from "../../components";
import { routes } from "../../navigation";
import { useNavigate } from "react-router-dom";
import { DownloadImageModal } from "../../components/download-image/download-image-modal";

interface Props {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

export const CanvasUserInterface: FC<Props> = ({ scale, handleZoomIn, handleZoomOut, handleResetZoom }) => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const navigate = useNavigate();

  const handleDownloadButtonClick = () => {
    setIsDownloadOpen(true);
  };

  const handleCloseDownload = () => {
    setIsDownloadOpen(false);
  };

  const handleHome = () => {
    navigate(routes.character);
  };

  return (
    <ControlAreaWrapper>
      <ControlAreaTop>
        <PrimaryButton onClick={handleHome}>Home</PrimaryButton>
      </ControlAreaTop>
      <ControlAreaBottom>
        <DownloadImageModal isOpen={isDownloadOpen} onClose={handleCloseDownload} />
        <PrimaryButton onClick={handleDownloadButtonClick}>Download</PrimaryButton>
        <ZoomContainer>
          <ZoomActions>
            <ZoomOutButton onClick={handleZoomOut}>
              <ZoomOut />
            </ZoomOutButton>
            <ZoomResetButton onClick={handleResetZoom}>{Math.round(scale * 100)}%</ZoomResetButton>
            <ZoomInButton onClick={handleZoomIn}>
              <ZoomIn />
            </ZoomInButton>
          </ZoomActions>
        </ZoomContainer>
      </ControlAreaBottom>
    </ControlAreaWrapper>
  );
};
