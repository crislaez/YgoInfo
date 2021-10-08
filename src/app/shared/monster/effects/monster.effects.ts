import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as MonsterActions from '../actions/monster.actions';
import { MonsterService } from '../services/monster.service';


@Injectable()
export class MonsterEffects {

  loadMonsters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MonsterActions.loadMonsters),
      switchMap(({ offset, typeCard, archetype, attribute, fname, race }) => {
        return this._monster.getMonsters( offset, fname, archetype, attribute, race, typeCard ).pipe(
          map(({monsters, total}) => MonsterActions.saveMosters({ monsters:monsters, total, error:undefined, offset, status:EntityStatus.Loaded, archetype, attribute, fname, race, typeCard })),
          catchError(error => {
            console.log(error)
            if(error === 400){
              return of(MonsterActions.saveMosters({ monsters:[], total:0, error, offset:0, status:EntityStatus.Loaded, archetype, attribute, fname, race, typeCard }))
            }
            return of(
              MonsterActions.saveMosters({ monsters:[], total:0, error, offset:0, status:EntityStatus.Error, archetype, attribute, fname, race, typeCard }),
              MonsterActions.loadMonstersFailure()
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

  loadMonsterFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MonsterActions.loadMonstersFailure),
      tap(() => this.presentToast(this.translate.instant('ERRORS.ERROR_LOAD_MONSTER_CARDS'), 'danger')),
    ), { dispatch: false }
  );


  constructor(
    private actions$: Actions,
    private _monster: MonsterService,
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
