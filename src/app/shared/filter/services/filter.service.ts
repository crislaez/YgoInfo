import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CoreConfigService } from '../../../core/services/core-config.service';



@Injectable({
  providedIn: 'root'
})
export class FilterService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;

  types = [
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

  attributes = [
    "dark",
    "earth",
    "fire",
    "light",
    "water",
    "wind",
    "divine"
  ];

  races = [
    "Aqua",
    "Beast",
    "Beast-Warrior",
    "Creator-God",
    "Cyberse",
    "Dinosaur",
    "Divine-Beast",
    "Dragon",
    "Fairy",
    "Fiend",
    "Fish",
    "Insect",
    "Machine",
    "Plant",
    "Psychic",
    "Pyro",
    "Reptile",
    "Rock",
    "Sea Serpent",
    "Spellcaster",
    "Thunder",
    "Warrior",
    "Winged Beast",

    "Continuous",
    "Normal",

    "Field",
    "Equip",
    "Quick-Play",
    "Ritual",

    "Counter",
  ];


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getTypes(): Observable<string[]>{
    return of(this.types)
  }

  getAttributes(): Observable<string[]>{
    return of(this.attributes)
  }

  getRaces(): Observable<string[]>{
    return of(this.races)
  }

  getArchetypes(): Observable<string[]>{
    return this.http.get<any>(`${this.baseURL}archetypes.php`).pipe(
      map((archertypes) => {
        // throw throwError('error')
        archertypes = (archertypes || [])?.map(({archetype_name}) => archetype_name)
        return (archertypes || []);
      }),
      catchError((error) => {
        return throwError(error)
      })
    )
  }
}