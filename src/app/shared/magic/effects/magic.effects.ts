import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as MagicActions from '../actions/magic.actions';
import { MagicService } from '../services/magic.service';


@Injectable()
export class MagicEffects {

  loadMagics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MagicActions.loadMagics),
      switchMap(({ offset, fname, race, format }) => {
        return this._magic.getMagics( offset, fname, race, format ).pipe(
          map(({magics, total}) => MagicActions.saveMagics({ magics, total, error:undefined, offset, status:EntityStatus.Loaded, fname, race, format})),
          catchError(error => {
            if(error === 400){
              return of(MagicActions.saveMagics({ magics:[], total:0, error, offset:0, status:EntityStatus.Loaded, fname, race, format}))
            }
            return of(
              MagicActions.saveMagics({ magics:[], total:0, error, offset:0, status:EntityStatus.Error, fname, race, format }),
              NotificationActions.notificationFailure({message:'ERRORS.ERROR_LOAD_MAGICS_CARDS'})
            )
          })
        )
      })
    );
  });


  constructor(
    private actions$: Actions,
    private _magic: MagicService,
    public toastController: ToastController,
  ) { }


}
