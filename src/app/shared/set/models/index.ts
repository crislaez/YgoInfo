export interface Set {
  "set_name": string;
  "set_code": string;
  "num_of_cards": number;
  "tcg_date": string;
}

export interface SetFilter {
  "search"?:string;
  "year"?:string
}
