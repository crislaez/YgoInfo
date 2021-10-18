import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationActions } from '@ygopro/shared/notification';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as MonsterActions from '../actions/monster.actions';
import { MonsterService } from '../services/monster.service';

@Injectable()
export class MonsterEffects {

  loadMonsters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MonsterActions.loadMonsters),
      switchMap(({ offset, typeCard, archetype, attribute, fname, race, format, level }) => {
        return this._monster.getMonsters( offset, fname, archetype, attribute, race, typeCard, format, level ).pipe(
          map(({monsters, total}) => MonsterActions.saveMosters({ monsters:monsters, total, error:undefined, offset, status:EntityStatus.Loaded, archetype, attribute, fname, race, typeCard, format, level })),
          catchError(error => {
            if(error === 400){
              return of(MonsterActions.saveMosters({ monsters:[], total:0, error, offset:0, status:EntityStatus.Loaded, archetype, attribute, fname, race, typeCard, format, level }))
            }
            return of(
              MonsterActions.saveMosters({ monsters:[], total:0, error, offset:0, status:EntityStatus.Error, archetype, attribute, fname, race, typeCard, format, level }),
              NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_MONSTER_CARDS'})
            )
          })
        )
      })
    );
  });


  constructor(
    private actions$: Actions,
    private _monster: MonsterService,
    public toastController: ToastController,
  ) { }


}
