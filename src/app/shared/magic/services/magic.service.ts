import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@ygopro/core/services/core-config.service';
import { Card } from '@ygopro/shared/shared/utils/models';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MagicService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  baseNumber: string = `${this._coreConfig.getCardsNumber()}`;
  types: string[] = this._coreConfig.getTypes()?.filter(item => item === 'Spell Card');


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getMagics(offset:number = 0, fname?:string, race?:string, format?:string): Observable<{magics:Card[], total:number}> {
    let params = new HttpParams();
    params = params.append('offset', offset);
    params = params.append('num', this.baseNumber);
    params = params.append('type', this.types?.join(','));

    if(!!format) params = params.append('format', format); //Rush Duel ..
    if(!!race) params = params.append('race', race); //Continious...
    if(!!fname) params = params.append('fname', fname); //Raigeky

    return this.http.get<any>(`${this.baseURL}cardinfo.php`, { params }).pipe(
      map(res => ({magics:res?.data || [], total:res?.meta?.total_rows || 0})),
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
