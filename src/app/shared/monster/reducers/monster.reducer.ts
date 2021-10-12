import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import * as MonsterActions from '../actions/monster.actions';
import { Card } from '@ygopro/shared/shared/models';

export const monsterFeatureKey = 'monster';

export interface State {
  statusMonsters: EntityStatus;
  monsters?: Card[];
  total?:number;
  offset?:number;
  type?:string;
  archetype?:string;
  attribute?:string;
  fname?:string;
  race?:string;
  format?:string;
  level?:string;
  error?:unknown;
}

export const initialState: State = {
  statusMonsters: EntityStatus.Initial,
  monsters: [],
  total:0,
  offset:0,
  type:'',
  archetype:'',
  attribute:'',
  fname:'',
  race:'',
  format:'',
  level: '',
  error: undefined
};

export const reducer = createReducer(
  initialState,
  on(MonsterActions.loadMonsters, (state): State => ({ ...state, error: undefined, statusMonsters: EntityStatus.Pending })),
  on(MonsterActions.saveMosters, (state, { monsters, total, error, status, offset, typeCard, archetype, attribute, fname, race, format, level}): State => {
    let stateMonsters:Card[] = [];
    if(offset === 0) stateMonsters = [...monsters];
    else stateMonsters = [...state.monsters, ...monsters ];
    return { ...state, monsters: stateMonsters, total, error, statusMonsters: status, offset, type:typeCard, archetype, attribute, fname, race, format, level }
  }),

);
