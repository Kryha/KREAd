export const findItemCategory = (category: string): string => {
  switch (category) {
    case "background2":
      return "background II";
    case "background1":
      return "background I";
    case "filter2":
      return "filter II";
    case "filter1":
      return "filter I";
    case "headpiece":
      return "head piece";
    case "airresevoir":
      return "air resevoir";
    default:
      return category;
  }
};
