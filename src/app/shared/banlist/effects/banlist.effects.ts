import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as BanlistActions from '../actions/banlist.actions';
import { BanlistService } from '../services/banlist.service';


@Injectable()
export class BanlistEffects {

  loadTCGBanlist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BanlistActions.loadTCGBanlist),
      switchMap(() => {
        return this._banlist.getBanlist('tcg').pipe(
          map((banlistTCG) => BanlistActions.saveTCGBanlist({ banlistTCG, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            if(error === 400){
              return of(BanlistActions.saveTCGBanlist({ banlistTCG:[], error, status:EntityStatus.Error }))
            }
            return of(
              BanlistActions.saveTCGBanlist({ banlistTCG:[], error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_BANLIST_TCG'})
            )
          })
        )
      })
    );
  });

  loadOCGBanlist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BanlistActions.loadOCGBanlist),
      switchMap(() => {
        return this._banlist.getBanlist('ocg').pipe(
          map((banlistOCG) => BanlistActions.saveOCGBanlist({ banlistOCG, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            if(error === 400){
              return of(BanlistActions.saveOCGBanlist({ banlistOCG:[], error, status:EntityStatus.Error }))
            }
            return of(
              BanlistActions.saveOCGBanlist({ banlistOCG:[], error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_BANLIST_OCG'})
            )
          })
        )
      })
    );
  });

  loadAlBanlist$ = createEffect(() => {
    return of(
      BanlistActions.loadTCGBanlist(),
      BanlistActions.loadOCGBanlist()
    )
  })


  constructor(
    private actions$: Actions,
    private _banlist: BanlistService,
    public toastController: ToastController,
  ) { }


}
