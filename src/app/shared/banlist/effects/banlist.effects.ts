import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as BanlistActions from '../actions/banlist.actions';
import { BanlistService } from '../services/banlist.service';


@Injectable()
export class BanlistEffects {

  loadCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BanlistActions.loadBanlist),
      switchMap(({ banlistType }) => {
        return this._banlist.getBanlist( banlistType ).pipe(
          map((banlist) => BanlistActions.saveBanlist({ banlist, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            if(error === 400){
              return of(BanlistActions.saveBanlist({ banlist:[], error, status:EntityStatus.Loaded }))
            }
            return of(
              BanlistActions.saveBanlist({ banlist:[], error, status:EntityStatus.Loaded }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_CARD'})
            )
          })
        )
      })
    );
  });


  constructor(
    private actions$: Actions,
    private _banlist: BanlistService,
    public toastController: ToastController,
  ) { }


}
