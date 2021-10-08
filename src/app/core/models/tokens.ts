import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  baseEndpoint: string;
  number: number;
}

export const ENVIRONMENT = new InjectionToken<Environment>('environment');
