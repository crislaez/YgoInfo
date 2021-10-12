import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
            // console.log(error)
            if(error === 400){
              return of(MagicActions.saveMagics({ magics:[], total:0, error, offset:0, status:EntityStatus.Loaded, fname, race, format}))
            }
            return of(
              MagicActions.saveMagics({ magics:[], total:0, error, offset:0, status:EntityStatus.Error, fname, race, format }),
              MagicActions.loadMagicsFailure()
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

  loadMagicsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MagicActions.loadMagicsFailure),
      tap(() => this.presentToast(this.translate.instant('ERRORS.ERROR_LOAD_MAGICS_CARDS'), 'danger')),
    ), { dispatch: false }
  );


  constructor(
    private actions$: Actions,
    private _magic: MagicService,
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
