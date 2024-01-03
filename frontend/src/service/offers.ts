import { useMemo } from "react";

import { useAgoricContext } from "../context/agoric";
import { OfferFilters } from "../util";

export const useOffers = (filters?: OfferFilters) => {
  const [{ offers }] = useAgoricContext();

  const filteredOffers = useMemo(() => {
    if (!filters) return offers;

    const filtered = offers.filter((offer) => {
      try {
        const descriptionCondition = filters.description ? offer.invitationDetails.description === filters.description : true;
        const statusCondition = filters.status ? offer.status === filters.status : true;

        return descriptionCondition && statusCondition;
      } catch (error) {
        return false;
      }
    });

    return filtered;
  }, [filters, offers]);

  return filteredOffers;
};
