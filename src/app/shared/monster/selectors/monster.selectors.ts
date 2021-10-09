import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMonster from '../reducers/monster.reducer';

export const selectMonsterState = createFeatureSelector<fromMonster.State>(
  fromMonster.monsterFeatureKey
);

export const getStatusMonsters = createSelector(
  selectMonsterState,
  (state) => state.statusMonsters
);

export const getOffset = createSelector(
  selectMonsterState,
  (state) => state.offset
);

export const getTotal = createSelector(
  selectMonsterState,
  (state) => state.total
);

export const getType = createSelector(
  selectMonsterState,
  (state) => state.type
);

export const getArchetype = createSelector(
  selectMonsterState,
  (state) => state.archetype
);

export const getAttribute = createSelector(
  selectMonsterState,
  (state) => state.attribute
);

export const getFname = createSelector(
  selectMonsterState,
  (state) => state.fname
);

export const getRace = createSelector(
  selectMonsterState,
  (state) => state.race
);

export const getMonsters = createSelector(
  selectMonsterState,
  (state) => state.monsters
);

export const getError = createSelector(
  selectMonsterState,
  (state) => state.error
);
