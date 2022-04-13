import { IonContent } from "@ionic/angular";
import { SwiperOptions } from "swiper";

export const trackById = (_: number, item: any): number => {
    return item.id;
  }

  export const errorImage = (event): void => {
    event.target.src = '../../../../assets/images/image_not_found.png';
  }

  export const emptyObject = (object: any): boolean => {
    return Object.keys(object || {})?.length > 0 ? true : false
  }

  export const getObjectKeys = (obj: any): any => {
    return Object.keys(obj || {})
  }

  export const gotToTop = (content: IonContent): void => {
    content.scrollToTop(500);
  }

  export const sliceTextSmall = (text: string) => {
    return text?.length > 17 ? text?.slice(0, 17) + '...' : text;
  }

  export const sliceTestMid = (text: string) => {
    return text?.length > 20 ? text?.slice(0, 20) + '...' : text;
  }

  export const sliceTest = (text: string) => {
    return text?.length > 25 ? text?.slice(0, 25) + '...' : text;
  }

  export const sliceTestLong = (text: string) => {
    return text?.length > 35 ? text?.slice(0, 35) + '...' : text;
  }

  export const getSliderConfig = (info:any): SwiperOptions => {
    return {
      slidesPerView: info?.length > 1 ? 2 : 1,
      spaceBetween: 30,
      freeMode: true,
      pagination:{ clickable: true },
      lazy: true,
      preloadImages: false
    };
  }

  export enum EntityStatus {
    Initial = 'initial',
    Pending = 'pending',
    Loaded = 'loaded',
    Error = 'error'
  };
