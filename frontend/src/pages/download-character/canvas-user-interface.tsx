import React, { FC, useState } from "react";
import {
  ControlAreaBody,
  ControlAreaBottom,
  ControlAreaBottomWrapper,
  ControlAreaButton,
  ControlAreaTop,
  ControlAreaWrapper,
  Download,
  DownloadButton,
  ZoomActions,
  ZoomContainer,
  ZoomIn,
  ZoomInButton,
  ZoomOut,
  ZoomOutButton,
  ZoomResetButton,
} from "./styles";
import { routes } from "../../navigation";
import { useNavigate } from "react-router-dom";
import { DownloadImageModal } from "../../components/download-image/download-image-modal";
import { useZoomCanvas } from "../../hooks/use-zoom-canvas";
import { text } from "../../assets";

export const CanvasUserInterface: FC = () => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const navigate = useNavigate();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomCanvas();
  const zoomPercentage = Math.round(scale * 100);

  const handleDownloadButtonClick = () => {
    setIsDownloadOpen(true);
  };

  const handleCloseDownload = () => {
    setIsDownloadOpen(false);
  };

  const handleGoToMyCharacters = () => {
    navigate(routes.character);
  };

  return (
    <ControlAreaWrapper>
      <ControlAreaBody>
        <DownloadImageModal isOpen={isDownloadOpen} onClose={handleCloseDownload} />
      </ControlAreaBody>
      <ControlAreaTop>
        <ControlAreaButton onClick={handleGoToMyCharacters}>{text.navigation.myCharacters}</ControlAreaButton>
      </ControlAreaTop>
      <ControlAreaBottomWrapper>
        <ControlAreaBottom>
          <DownloadButton onClick={handleDownloadButtonClick}>
            <Download />
          </DownloadButton>
          <ZoomContainer>
            <ZoomActions>
              <ZoomOutButton onClick={handleZoomOut}>
                <ZoomOut />
              </ZoomOutButton>
              <ZoomResetButton onClick={handleResetZoom}>{zoomPercentage}%</ZoomResetButton>
              <ZoomInButton onClick={handleZoomIn}>
                <ZoomIn />
              </ZoomInButton>
            </ZoomActions>
          </ZoomContainer>
        </ControlAreaBottom>
      </ControlAreaBottomWrapper>
    </ControlAreaWrapper>
  );
};
