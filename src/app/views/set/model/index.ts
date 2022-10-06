import { Filter } from '@ygopro/shared/card';

export interface SetComponentState {
  setName?: string;
  page?:number;
  filter?: Filter;
  refresh?: boolean;
};
