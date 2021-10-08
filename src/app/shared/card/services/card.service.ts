import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card } from '@ygopro/shared/shared/models';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CoreConfigService } from '../../../core/services/core-config.service';


@Injectable({
  providedIn: 'root'
})
export class CardService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getCardById(id:number = 0): Observable<Card> {

    return this.http.get<any>(`${this.baseURL}cardinfo.php?id=${id}`).pipe(
      map(res => (res?.data[0] || {})),
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
