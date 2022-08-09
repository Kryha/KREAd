export const truncateAddress = (address: string) => {
  const truncatedAddress = address.substring(0, 5) + "..." + address.substring(address.length - 4);

  return truncatedAddress;
};
