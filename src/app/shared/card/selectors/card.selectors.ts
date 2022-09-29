import { createFeatureSelector, createSelector } from '@ngrx/store';
import { combineFeatureKey, CombineState } from '../reducers';
import { cardListFeatureKey } from '../reducers/card.reducer';
import { setCardFeatureKey } from '../reducers/set-card.reducer';


export const selectCombineState = createFeatureSelector<CombineState>(combineFeatureKey);

/* === CARDLIST === */
export const selectCardListState = createSelector(
  selectCombineState,
  (state) => state[cardListFeatureKey]
);

export const selectStatus = createSelector(
  selectCardListState,
  (state) => state?.status
);

export const selectCards = createSelector(
  selectCardListState,
  (state) => state?.cards
);

export const selectTotalCount = createSelector(
  selectCardListState,
  (state) => state?.totalCount
);

export const selectFilters = createSelector(
  selectCardListState,
  (state) => state?.filter
)

export const selectPage = createSelector(
  selectCardListState,
  (state) => state?.page
);

export const selectError = createSelector(
  selectCardListState,
  (state) => state?.error
);


/* === SET CARD === */
export const selectSetCardState = createSelector(
  selectCombineState,
  (state) => state[setCardFeatureKey]
);

export const selectAllSetsCards = createSelector(
  selectSetCardState,
  (state) => state?.sets
);

export const selectAllSetsError = createSelector(
  selectSetCardState,
  (state) => state?.error
);

export const selectSetCards = (setName: string) => createSelector(
  selectAllSetsCards,
  (allSets) => allSets?.[setName]?.cards
);

export const selectSetCardsStatus = (setName: string) => createSelector(
  selectAllSetsCards,
  (allSets) => allSets?.[setName]?.status
);

export const selectSetCardFilter = (setName: string) => createSelector(
  selectAllSetsCards,
  (allSets) => allSets?.[setName]?.filter
);

export const selectSetCardTotalCount = (setName: string) => createSelector(
  selectAllSetsCards,
  (allSets) => allSets?.[setName]?.totalCount
);

export const selectSetCardTPage = (setName: string) => createSelector(
  selectAllSetsCards,
  (allSets) => allSets?.[setName]?.page
);
