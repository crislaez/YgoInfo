import { Filter } from '@ygopro/shared/card';

export interface CardComponentState {
  page:number,
  filter: Filter,
  refresh?: boolean;
};
