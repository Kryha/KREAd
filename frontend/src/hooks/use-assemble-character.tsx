import { useEffect, useMemo, useState } from "react";
import Konva from "konva";
import { Empty } from "../assets";
import { useGetItemsInInventory, useSelectedCharacter } from "../service";
import { CHARACTER_HEIGHT, CHARACTER_WIDTH } from "../constants";
import { Category } from "../interfaces";

interface Item {
  category: Category;
  image: string;
  name: string;
  equippedTo: string | undefined;
}

const assembledCharacterOrder = [
  "background",
  "patch",
  "character",
  "hair",
  "headPiece",
  "mask",
  "perk1",
  "perk2",
  "filter1",
  "filter2",
  "clothing",
];

export function useAssembleCharacter(width: number, height: number) {
  const stageAspectRatio = height / width;
  const [selectedCharacter] = useSelectedCharacter();
  const character = useMemo(() => selectedCharacter?.nft, [selectedCharacter]);
  const [itemsInventory] = useGetItemsInInventory();

  const [assembledCharacter, setAssembledCharacter] = useState<Konva.Group | null>(null);

  const organizedItems: Record<string, Item[]> = {};
  assembledCharacterOrder.forEach((category) => {
    organizedItems[category] = [];
  });

  const itemsOfTypeItem: Item[] = itemsInventory.map((item) => ({
    category: item.category,
    image: item.image || Empty,
    name: item.name,
    equippedTo: item.equippedTo,
  }));

  // Organize the items into the organizedItems object
  itemsOfTypeItem.forEach((item) => {
    if (organizedItems[item.category]) {
      if (item.equippedTo === character?.name) {
        // Add equipped items at the beginning of the array
        organizedItems[item.category].unshift(item);
      } else {
        // Add unequipped items at the end of the array
        organizedItems[item.category].push(item);
      }
    }
  });

  const characterInfo = {
    category: "character",
    image: character?.image,
    name: character?.name,
    equippedTo: character?.name,
  };

  organizedItems["character"].push(characterInfo as Item);

  const extendedCharacter = new Konva.Group({
    preventDefault: true,
    centeredScaling: true,
    x: width / 2,
    y: height / 2,
  });

  const uniqueCategories = new Set();

  useEffect(() => {
    if (!character) return;
    assembledCharacterOrder.forEach((category) => {
      const itemsInCategory = organizedItems[category] || [];
      const categoryGroup = new Konva.Group();

      if (!uniqueCategories.has(category)) {
        itemsInCategory.forEach((item) => {
          const imagePromise = loadImage(item, character.name);

          imagePromise
            .then((imageNode) => {
              // Add the image to the category group
              categoryGroup.add(imageNode);
              const assembledCharacterWidth = CHARACTER_WIDTH;
              const assembledCharacterHeight = CHARACTER_HEIGHT;
              const aspectRatio = assembledCharacterHeight / assembledCharacterWidth;

              let newWidth = width;
              let newHeight = height;

              if (stageAspectRatio < aspectRatio) {
                newWidth = height / aspectRatio;
              } else {
                newHeight = width * aspectRatio;
              }
              const scaleX = newWidth / assembledCharacterWidth;
              const scaleY = newHeight / assembledCharacterHeight;

              categoryGroup.setAttrs({
                aspectRatio,
                id: imageNode.getAttr("category"),
                category: imageNode.getAttr("category"),
                width: newWidth,
                height: newHeight,
                scaleX,
                scaleY,
                crossOrigin: "anonymous",
              });

              // Check if all images in the category have been loaded
              if (categoryGroup.getChildren().length === itemsInCategory.length) {
                categoryGroup.getChildren().forEach((image) => {
                  const isEquipped = image.getAttr("equipped");
                  if (isEquipped) {
                    image.show();
                  } else {
                    image.hide();
                  }
                });
              }
            })
            .catch((error) => {
              console.error(`Error loading image to canvas ${item.category} - ${item.name}`, error);
            });
        });

        // Add the category group to the assembledCharacterGroup
        extendedCharacter.setAttrs({
          name: character?.name,
          id: character?.id,
          width: categoryGroup.width(),
          height: categoryGroup.height(),
        });
        extendedCharacter.add(categoryGroup);
        setAssembledCharacter(extendedCharacter);
      }
    });
  }, [character, width, height]);

  return assembledCharacter;
}

const loadImage = (item: Item, characterName: string) => {
  return new Promise<Konva.Image>((resolve, reject) => {
    const imgElement = new Image();
    imgElement.src = item.image;
    imgElement.onload = () => {
      const imageNode = new Konva.Image({
        image: imgElement,
        name: item.name,
        width: CHARACTER_WIDTH,
        height: CHARACTER_HEIGHT,
        offsetX: CHARACTER_WIDTH / 2,
        offsetY: CHARACTER_HEIGHT / 2,
        category: item.category,
        id: item.category,
        equipped: item.equippedTo === characterName,
        crossOrigin: "anonymous",
      });
      resolve(imageNode);
    };
    imgElement.onerror = () => {
      reject(new Error(`Failed to load image from url: ${item.category} - ${item.image}`));
    };
  });
};
