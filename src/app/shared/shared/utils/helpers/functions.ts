import { IonContent } from "@ionic/angular";

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

  export const sliceTest = (text: string) => {
    return text?.length > 25 ? text?.slice(0, 25) + '...' : text;
  }

  export const sliceTestLong = (text: string) => {
    return text?.length > 35 ? text?.slice(0, 35) + '...' : text;
  }

  export enum EntityStatus {
    Initial = 'initial',
    Pending = 'pending',
    Loaded = 'loaded',
    Error = 'error'
  };
