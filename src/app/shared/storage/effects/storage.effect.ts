import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EntityStatus } from '@ygopro/shared/shared/utils/helpers/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
      tap(({message}) => this.presentToast(this.translate.instant(message), 'success')),
    ), { dispatch: false }
  );

  failure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        StorageActions.loadStorageFailure,
        StorageActions.saveCardFailure,
        StorageActions.deleteCardFailure
      ),
      tap(({message}) => this.presentToast(this.translate.instant(message), 'danger')),
    ), { dispatch: false }
  );

  tryLoadStorage$ = createEffect(() => {
    return of(StorageActions.loadStorage())
  });


  constructor(
    private actions$: Actions,
    private _storage: StorageService,
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
