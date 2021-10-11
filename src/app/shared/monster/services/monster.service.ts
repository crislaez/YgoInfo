import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CoreConfigService } from '../../../core/services/core-config.service';
import { Monster } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MonsterService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  baseNumber: string = `${this._coreConfig.getCardsNumber()}`;
  types: string[] = this._coreConfig.getTypes()?.filter(item => item !== 'Spell Card' && item !== 'Trap Card');


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getMonsters(offset:number = 0, fname?:string, archetype?:string, attribute?:string, race?:string, type?:string, format?:string): Observable<{monsters:Monster[], total:number}> {
    console.log()
    let params = new HttpParams();
    params = params.append('offset', offset);
    params = params.append('num', this.baseNumber);

    if(!!format) params = params.append('format', format); //Blue-Eyes...
    if(!!archetype) params = params.append('archetype', archetype); //Blue-Eyes...
    if(!!attribute) params = params.append('attribute', attribute);// Water, Fire...
    if(!!race) params = params.append('race', race); //Aqua, Beast, Donosaur ...
    if(!!fname) params = params.append('fname', fname); //Wizard
    if(!!type) params = params.append('type', type); //Effect Monster, Flip Effect Monster, XYZ Monster
    else params = params.append('type', this.types?.join(','));

    return this.http.get<any>(`${this.baseURL}cardinfo.php`, { params }).pipe(
      map(res => ({monsters:res?.data || [], total:res?.meta?.total_rows || 0})),
      // map(() => {
      //   throw throwError('error')
      // }),
      catchError((error) => {
        if( error?.error === 'No card matching your query was found in the database. Please see https://db.ygoprodeck.com/api-guide/ for syntax usage.'){
          error = 400
        }
        return throwError(error)
      })
    )
  }

}
