import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/utils/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as StorageActions from '../actions/storage.actions';
import { StorageService } from '../services/storage.service';


@Injectable()
export class StorageEffects {

  loadStorage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        StorageActions.loadStorage,
        StorageActions.saveCardSuccess,
        StorageActions.deleteCardSuccess
      ),
      switchMap(() => {
        return this._storage.getCards().pipe(
          map((cards) => StorageActions.saveStorage({ storage: cards || [], error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              StorageActions.saveStorage({ storage:[], error,  status:EntityStatus.Error }),
              StorageActions.loadStorageFailure({message:'ERRORS.ERROR_LOAD_SAVE_CARDS'})
            )
          })
        )
      })
    );
  });

  saveCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StorageActions.saveCard),
      switchMap(({card}) => {
        return this._storage.saveCard(card).pipe(
          map(({code}) => {
            if(code === 403) return StorageActions.saveCardFailure({error:code, message:'ERRORS.ERROR_LIMIT_EXCESS'});
            return StorageActions.saveCardSuccess({ message:'COMMON.SAVE_CARD_SUCCESS' });
          }),
          catchError(error => {
            return of(StorageActions.saveCardFailure({error, message:'ERRORS.ERROR_TO_SAVE_CARDS'}))
          })
        )
      })
    );
  });

  deleteCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StorageActions.deleteCard),
      switchMap(({id}) => {
        return this._storage.deleteCard(id).pipe(
          map(({code}) => {
            if(code === 403) StorageActions.deleteCardFailure({error: code, message:'ERRORS.ERROR_TO_DELETE_CARDS'})
            return StorageActions.deleteCardSuccess({ message:'COMMON.DELETE_CARD_SUCCESS' })
          }),
          catchError(error => {
            return of(StorageActions.deleteCardFailure({error, message:'ERRORS.ERROR_TO_DELETE_CARDS'}))
          })
        )
      })
    );
  });

  messageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        StorageActions.saveCardSuccess,
        StorageActions.deleteCardSuccess
      ),
      map(({message}) => NotificationActions.notificationSuccess({message}))
    )
  );

  failure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        StorageActions.loadStorageFailure,
        StorageActions.saveCardFailure,
        StorageActions.deleteCardFailure
      ),
      map(({message}) => NotificationActions.notificationFailure({message}))
    )
  );

  tryLoadStorage$ = createEffect(() => {
    return of(StorageActions.loadStorage())
  });



  constructor(
    private actions$: Actions,
    private _storage: StorageService,
  ) { }


}
