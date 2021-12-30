import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
              return of(CardActions.saveCard({ card:{}, error, status:EntityStatus.Loaded }))
            }
            return of(
              CardActions.saveCard({ card:{}, error, status:EntityStatus.Loaded }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_CARD'})
            )
          })
        )
      })
    );
  });


  constructor(
    private actions$: Actions,
    private _card: CardService,
    public toastController: ToastController,
  ) { }


}
