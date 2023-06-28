import React, { FC } from "react";
import {
  ControlArea,
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
import Konva from "konva";

interface Props {
  stageRef: React.RefObject<Konva.Stage>;
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  handleDownload: () => void;
}

export const CanvasUserInterface: FC<Props> = ({ stageRef, scale, handleZoomIn, handleZoomOut, handleResetZoom, handleDownload }) => {
  return (
    <ControlAreaWrapper>
      <ControlArea>
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
        <PrimaryButton onClick={handleDownload}>Download</PrimaryButton>
      </ControlArea>
    </ControlAreaWrapper>
  );
};
