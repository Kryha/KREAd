import { useEffect, useState } from 'react';
import { useViewport } from './use-viewport';

export const useMobile = () => {

  const { width} = useViewport();
  const [mobile, setMobile] = useState<boolean>(false);
  useEffect(() => {
    if (width <= 768) {
      setMobile(true);
    } else{
      setMobile(false);
    }
  }, [width])

  return mobile;
}
