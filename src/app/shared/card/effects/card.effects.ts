import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as CardActions from '../actions/card.actions';
import { CardService } from '../services/card.service';


@Injectable()
export class CardEffects {

  loadCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardActions.loadCard),
      switchMap(({ id }) => {
        return this._card.getCardById( id ).pipe(
          map((card) => CardActions.saveCard({ card, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            if(error === 400){
              return of(CardActions.saveCard({ card:null, error, status:EntityStatus.Loaded }))
            }
            return of(
              CardActions.saveCard({ card:null, error, status:EntityStatus.Loaded }),
              CardActions.loadCardFailure()
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

  loadCardFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardActions.loadCardFailure),
      tap(() => this.presentToast(this.translate.instant('ERRORS.ERROR_LOAD_CARD'), 'danger')),
    ), { dispatch: false }
  );


  // try$ = createEffect(() => {
  //   return of(CardActions.loadCard({id:86988864}))
  // })

  constructor(
    private actions$: Actions,
    private _card: CardService,
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
