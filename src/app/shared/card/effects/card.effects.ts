import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as CardActions from '../actions/card.actions';
import { CardService } from '../services/card.service';


@Injectable()
export class CardEffects {

  loadCards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardActions.loadCards),
      switchMap(({page, filter}) => {
        return this._card.getAllCards(page, filter).pipe(
          map(({cards, totalCount }) => CardActions.saveCards({ cards, page, totalCount, filter, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            if(error === 701){
              return of(CardActions.saveCards({ cards:[], page:0, totalCount:0, error, status:EntityStatus.Loaded }))
            }

            return of(
              CardActions.saveCards({ cards:[], page:0, totalCount:0, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_CARD'})
            )
          })
        )
      })
    )
  });

  loadSetCards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardActions.loadSetCards),
      switchMap(({setName, page, filter}) => {
        return this._card.getAllCards(page, filter).pipe(
          map(({cards, totalCount }) => CardActions.saveSetCards({ setName, cards, page, totalCount, filter, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            if(error === 701){
              return of(CardActions.saveSetCards({ setName, cards:[], page:0, totalCount:0, error, status:EntityStatus.Loaded }))
            }

            return of(
              CardActions.saveSetCards({ setName, cards:[], page:0, totalCount:0, error, status:EntityStatus.Error }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_CARD'})
            )
          })
        )
      })
    )
  });

  tryloadCards$ = createEffect(() => {
    return of(
      CardActions.loadCards({page:0, filter:{}})
    )
  });


  constructor(
    private actions$: Actions,
    private _card: CardService,
    public toastController: ToastController,
  ) { }


}
