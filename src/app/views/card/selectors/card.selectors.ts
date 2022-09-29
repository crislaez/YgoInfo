import { createSelector } from "@ngrx/store";
import { fromFilter } from "@ygopro/shared/filter";


export const cardFilterSelectors = createSelector(
  fromFilter.getFormats,
  fromFilter.getTypes,
  fromFilter.getArchetypes,
  (cardFormat, cardType, archetype) => {
    return {
      cardFormat: cardFormat ?? [],
      cardType: cardType ?? [],
      archetype: archetype ?? []
    }
  }
);
