import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TrapActions from '../actions/trap.actions';
import { TrapService } from '../services/trap.service';


@Injectable()
export class TrapEffects {

  loadTraps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrapActions.loadTraps),
      switchMap(({ offset, fname, race, format }) => {
        return this._trap.getTraps( offset, fname, race, format ).pipe(
          map(({traps, total}) => TrapActions.saveTraps({ traps, total, error:undefined, offset, status:EntityStatus.Loaded, fname, race, format })),
          catchError(error => {
            // console.log(error)
            if(error === 400){
              return of(TrapActions.saveTraps({ traps:[], total:0, error, offset:0, status:EntityStatus.Loaded, fname, race, format }))
            }
            return of(
              TrapActions.saveTraps({ traps:[], total:0, error, offset:0, status:EntityStatus.Error, fname, race, format }),
              NotificationActions.notificationFailure({message:'ERRORS.ERROR_LOAD_TRAP_CARDS'})
            )
          })
        )
      })
    );
  });


  constructor(
    private actions$: Actions,
    private _trap: TrapService,
    public toastController: ToastController,
  ) { }


}
