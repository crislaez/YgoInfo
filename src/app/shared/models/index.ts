export interface Card {
  id?: number,
  name?: string;
  type?: string;
  desc?: string;
  atk?: number;
  def?: number;
  level?: number;
  scale?:number;
  linkval?:number;
  race?: string;
  attribute?: string;
  banlist_info?: Banlist;
  card_sets?: CardSet[];
  card_images?: CardImage[];
  card_prices?: CardPrices[];
}

export interface CardImage {
  id?: number;
  image_url?: string;
  image_url_small: string;
}

export interface CardPrices {
  cardmarket_price?: string;
  tcgplayer_price?: string;
  ebay_price?: string;
  amazon_price?: string;
  coolstuffinc_price?: string;
}

export interface CardSet {
  set_name?: string;
  set_code?: string;
  set_rarity?: string;
  set_rarity_code?: string;
  set_price?: string;
}

export interface Banlist {
  ban_ocg?: string;
  ban_tcg?: string;
}
