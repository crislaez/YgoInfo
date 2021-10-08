import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '../models/tokens'

export enum EndpointType {
  api = '/api/',
}

export interface CoreConfig {
  langs: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CoreConfigService {

  protected _config: CoreConfig;

  types: string[] = [
    "Effect Monster",
    "Flip Effect Monster",
    "Flip Tuner Effect Monster",
    "Gemini Monster",
    "Normal Monster",
    "Normal Tuner Monster",
    "Pendulum Effect Monster",
    "Pendulum Flip Effect Monster",
    "Pendulum Normal Monster",
    "Pendulum Tuner Effect Monster",
    "Ritual Effect Monster",
    "Ritual Monster",
    "Skill Card",
    "Spell Card",
    "Spirit Monster",
    "Toon Monster",
    "Trap Card",
    "Tuner Monster",
    "Union Effect Monster",
    "Fusion Monster",
    "Link Monster",
    "Pendulum Effect Fusion Monster",
    "Synchro Monster",
    "Synchro Pendulum Effect Monster",
    "Synchro Tuner Monster",
    "XYZ Monster",
    "XYZ Pendulum Effect Monster"
  ];


  constructor(@Inject(ENVIRONMENT) private _env: Environment) { }


  importConfig(coreConfigRaw: any): void {
    this._config = {
      langs: coreConfigRaw.Languages
    } as CoreConfig;
  }

  getEndpoint(): string {
    return `${this._env.baseEndpoint}`;
  }

  getCardsNumber(): string {
    return `${this._env.number}`;
  }

  getTypes(): string[] {
    return this.types;
  }


}
