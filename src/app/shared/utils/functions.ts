import { IonContent } from "@ionic/angular";
import { SwiperOptions } from "swiper";
import { Card } from "../models";

export const trackById = (_: number, item: any): number => {
  return item.id ?? item ?? item?.set_name;
}

export const errorImage = (event): void => {
  event.target.src = '../../../../assets/images/image_not_found.png';
}

export const isNotEmptyObject = (object: any): boolean => {
  return Object.keys(object || {})?.length > 0 ? true : false
}

export const getObjectKeys = (obj: any): any => {
  return Object.keys(obj || {})
}

export const gotToTop = (content: IonContent): void => {
  content.scrollToTop(500);
}

export const sliceText = (text: string, long: number) => {
  return text?.length > long ? text?.slice(0, long) + '...' : text;
}

export const sortByDate = (array: any[], field: string) => {
  return [...(array ?? [])]?.sort((a, b) => {
    const aItem = new Date(a?.[field]);
    const bItem = new Date(b?.[field]);
    // console.log('aItem => ',aItem)
    if(aItem < bItem) return 1
    if(aItem > bItem) return -1
    return 0;
  })
}

export const getSliderConfig = (info:any): SwiperOptions => {
  return {
    slidesPerView: 2,
    spaceBetween: 30,
    freeMode: true,
    pagination:{ clickable: true },
    lazy: true,
    preloadImages: false
  };
}

export const getLastNumber = (number: number) => {
  return Number(number?.toString()?.slice(-1)) || 0;
}

export const cardColor = (card: Card): string =>  {
  const { type = null } = card || {};
  if(type?.includes('Ritual Effect Monster') || type?.includes('Ritual Monster')) return '#4072D6';
  if(type?.includes('Link Monster')) return '#006EAD';
  if(type?.includes('Fusion Monste')) return '#9271BC';
  if(type?.includes('XYZ Monster')) return '#585757';
  if(type?.includes('Synchro Monster')) return '#CCCCCC';
  if(type?.includes('Normal Monster')) return '#F6E2BD';
  if(type?.includes('Monster')) return '#EEB99B';
  // if(type?.includes('Effect Monster') || type?.includes('Tuner  Monster')) return '#EBCFC1';
  if(type?.includes('Spell Card')) return '#3BC2AE';
  if(type?.includes('Trap Card')) return '#E273B7';
  return '#EBBCCF';
}

export const appColors = {
  0:'#8F98FF',
  1:'#FB774D',
  2:'#4DC590',
  3:'#3C396E',
  4:'#E74C3C',
  5:'#B7B7B7',
  6:'#6C3483',
  7:'#C383E1',
  8:'#2874A6',
  9:'#1ABC9C',
}

export const BANNED = '/assets/images/banned.svg';
export const LIMIT = '/assets/images/limited.svg';
export const SEMI_LIMIT = '/assets/images/semi-limited.svg';

export enum EntityStatus {
  Initial = 'initial',
  Pending = 'pending',
  Loaded = 'loaded',
  Error = 'error'
};
