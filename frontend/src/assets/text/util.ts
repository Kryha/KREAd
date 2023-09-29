const correctDescriptionString = (description: string) => {
  description = description.replace("headPiece", "headpiece");
  description = description.replace("Itâs", "It's");
  description = description.replace("commu nicator", "communicator");

  return description;
};

export const util = { correctDescriptionString };
