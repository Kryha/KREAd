import { useEffect, useState } from "react";

export const useTimer = (delay: number, condition: boolean) => {
  const [showFirstPage, setShowFirstPage] = useState(false);

  useEffect(
    () => {
      let timer1: NodeJS.Timeout;
      if(condition) {
        timer1 = setTimeout(() => setShowFirstPage(true), delay * 1000);
      }
      return () => {
        clearTimeout(timer1);
      };
    },
    [condition, delay]
  );

  return [showFirstPage, setShowFirstPage] as const;
};
