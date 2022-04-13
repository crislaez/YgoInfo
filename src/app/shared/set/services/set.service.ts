import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@ygopro/core/services/core-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Set } from '../models';


@Injectable({
  providedIn: 'root'
})
export class SetService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  baseNumber: string = `${this._coreConfig.getCardsNumber()}`;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getSets(): Observable<{sets: Set[]}> {
    return this.http.get<any>(`${this.baseURL}cardsets.php`).pipe(
      map(res => ({sets: res || []})),
      catchError((error) => {
        if( error?.error === 'No card matching your query was found in the database. Please see https://db.ygoprodeck.com/api-guide/ for syntax usage.'){
          error = 400
        }
        return throwError(error)
      })
    )
  }


}

