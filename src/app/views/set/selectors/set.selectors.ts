import { createSelector } from "@ngrx/store";
import { fromFilter } from "@ygopro/shared/filter";


export const setSelectors = createSelector(
  fromFilter.getFormats,
  fromFilter.getTypes,
  (cardFormat, cardType) => {
    return {
      cardFormat: cardFormat ?? [],
      cardType: cardType ?? []
    }
  }
);
