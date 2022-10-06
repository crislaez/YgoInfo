import { SetFilter } from "@ygopro/shared/set/models";

export interface SetsComponentState {
  slice?:number;
  filter?:SetFilter;
  refresh?: boolean;
};
