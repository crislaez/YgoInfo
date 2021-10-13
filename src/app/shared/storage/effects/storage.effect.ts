import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
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
        StorageActions.createStorageSuccess
      ),
      switchMap(() => {
        return this._storage.getCards().pipe(
          map(({cards}) => StorageActions.saveStorage({ storage: cards || [], error:undefined, status:EntityStatus.Loaded })),
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

  createStorage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StorageActions.createStorage),
      switchMap(({card}) => {
        return this._storage.createCard(card).pipe(
          map(() => StorageActions.createStorageSuccess({ message:'COMMON.SAVE_CARD_SUCCESS' })),
          catchError(error => {
            return of(StorageActions.createStorageFailure({error, message:'ERRORS.ERROR_TO_SAVE_CARDS'}))
          })
        )
      })
    );
  });

  deleteStorage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StorageActions.deleteStorage),
      switchMap(({id}) => {
        return this._storage.deleteCard(id).pipe(
          map(() => StorageActions.deleteStorageSuccess({ message:'COMMON.DELETE_CARD_SUCCESS' })),
          catchError(error => {
            return of(StorageActions.deleteStorageFailure({error, message:'ERRORS.ERROR_TO_DELETE_CARDS'}))
          })
        )
      })
    );
  });

  messageSuccess$ = createEffect(() =>
    this.actions$.pipe(
    ofType(
      StorageActions.createStorageSuccess,
      StorageActions.deleteStorageSuccess
    ),
      tap(({message}) => this.presentToast(this.translate.instant(message), 'success')),
    ), { dispatch: false }
  );

  failure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        StorageActions.loadStorageFailure,
        StorageActions.createStorageFailure,
        StorageActions.deleteStorageFailure
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
