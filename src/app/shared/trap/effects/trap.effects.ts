import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as TrapActions from '../actions/trap.actions';
import { TrapService } from '../services/trap.service';


@Injectable()
export class TrapEffects {

  loadTraps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrapActions.loadTraps),
      switchMap(({ offset, fname, race }) => {
        return this._trap.getTraps( offset, fname, race,  ).pipe(
          map(({traps, total}) => TrapActions.saveTraps({ traps, total, error:undefined, offset, status:EntityStatus.Loaded, fname, race })),
          catchError(error => {
            // console.log(error)
            if(error === 400){
              return of(TrapActions.saveTraps({ traps:[], total:0, error, offset:0, status:EntityStatus.Loaded, fname, race }))
            }
            return of(
              TrapActions.saveTraps({ traps:[], total:0, error, offset:0, status:EntityStatus.Error, fname, race }),
              TrapActions.loadTrapsFailure()
            )
          })
        )
      })
    );
  });

  // messageSuccessAuth$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.updateSuccess),
  //     tap(({message}) => this.presentToast(this.translate.instant(message), 'success')),
  //   ), { dispatch: false }
  // );

  loadTrapsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrapActions.loadTrapsFailure),
      tap(() => this.presentToast(this.translate.instant('ERRORS.ERROR_LOAD_trapS_CARDS'), 'danger')),
    ), { dispatch: false }
  );


  constructor(
    private actions$: Actions,
    private _trap: TrapService,
    private translate: TranslateService,
    public toastController: ToastController,
  ) { }


  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 1000
    });
    toast.present();
  }

}
