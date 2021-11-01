import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@ygopro/core/services/core-config.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BanlistService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getBanlist(banlistType: string): Observable<any>{
    // ban_tcg ban_ocg ban_goat
    return this.http.get<any>(`${this.baseURL}cardinfo.php?banlist=${banlistType}`).pipe(//&sort=name
      map(res => {
        const type = banlistType === 'tcg' ? 'ban_tcg' : 'ban_ocg';
        const { data = null } = res || {};

        const banned = data?.filter(({banlist_info}) => banlist_info[type] === 'Banned');
        const limited = data?.filter(({banlist_info}) => banlist_info[type] === 'Limited');
        const semiLimited = data?.filter(({banlist_info}) => banlist_info[type] === 'Semi-Limited');

        let filterResponse = [
          ...(banned ? banned : []),
          ...(limited ? limited : []),
          ...(semiLimited? semiLimited : [])
        ] || []

        return filterResponse
      }),
      catchError((error) => {
        if( error?.error === 'No card matching your query was found in the database. Please see https://db.ygoprodeck.com/api-guide/ for syntax usage.'){
          error = 400
        }
        return throwError(error)
      })
    )

  }


}
