import { FC } from "react";
import { Bar, HistogramWrapper } from "./styles";

interface Props {
  prices: number[];
}
const Histogram: FC<Props> = ({ prices }) => {
  // Create an object to store the count of each unique price
  const priceCounts: { [key: string]: number } = {};

  // Find the maximum count to use for scaling
  let maxCount = 0;
  prices.forEach((price) => {
    const priceKey = price.toString(); // Ensure the key is a string
    if (!priceCounts[priceKey]) {
      priceCounts[priceKey] = 1;
    } else {
      priceCounts[priceKey]++;
    }
    if (priceCounts[priceKey] > maxCount) {
      maxCount = priceCounts[priceKey];
    }
  });

  return (
    <HistogramWrapper>
      {Object.entries(priceCounts).map(([price, count]) => (
        <Bar
          key={price}
          style={{
            height: `${(count / maxCount) * 100}%`,
          }}
        />
      ))}
    </HistogramWrapper>
  );
};

export default Histogram;
