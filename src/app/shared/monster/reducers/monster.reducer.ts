import { createReducer, on } from '@ngrx/store';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import * as MonsterActions from '../actions/monster.actions';
import { Monster } from '../models';

export const monsterFeatureKey = 'monster';

export interface State {
  statusMonsters: EntityStatus;
  monsters?: Monster[];
  total?:number;
  offset?:number;
  type?:string;
  archetype?:string;
  attribute?:string;
  fname?:string;
  race?:string;

  statusMonster: EntityStatus;
  monster?: Monster;
  error?: unknown;
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

  statusMonster: EntityStatus.Initial,
  monster: null,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(MonsterActions.loadMonsters, (state): State => ({ ...state, statusMonsters: EntityStatus.Pending })),
  on(MonsterActions.saveMosters, (state, { monsters, total, error, status, offset, typeCard, archetype, attribute,fname, race  }): State => {
    let stateMonsters:Monster[] = [];
    if(offset === 0) stateMonsters = [...monsters];
    else stateMonsters = [...state.monsters, ...monsters ];
    return { ...state, monsters: stateMonsters, total, error, statusMonsters: status, offset, type:typeCard, archetype, attribute, fname, race }
  }),

);
