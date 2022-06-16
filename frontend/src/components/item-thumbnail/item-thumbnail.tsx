import { FC } from "react";

import { ImageProps } from "../atoms";
import { ImageCard, ItemImage } from "./styles";

interface Props extends ImageProps {
  category?: string;
}

export const ItemThumbnail: FC<Props> = (props) => {
  return (
    <ImageCard>
      <ItemImage {...props} />
    </ImageCard>
  );
};
