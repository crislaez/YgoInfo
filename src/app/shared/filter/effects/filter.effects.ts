import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EntityStatus } from '@ygopro/shared/shared/utils/utils';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as FilterActions from '../actions/filter.actions';
import { FilterService } from '../services/filter.service';


@Injectable()
export class FilterEffects {


  loadArchetypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FilterActions.loadArchetypes),
      switchMap(() => {
        return this._filter.getArchetypes().pipe(
          map((archetypes) => FilterActions.saveArchetypes({ archetypes, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              FilterActions.saveArchetypes({ archetypes:[], error, status:EntityStatus.Loaded}),
            )
          })
        )
      })
    );
  });

  loadAttributes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FilterActions.loadAttributes),
      switchMap(() => {
        return this._filter.getAttributes().pipe(
          map((attributes) => FilterActions.saveAttributtes({ attributes, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              FilterActions.saveAttributtes({ attributes:[], error, status:EntityStatus.Loaded}),
            )
          })
        )
      })
    );
  });

  loadRaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FilterActions.loadRaces),
      switchMap(() => {
        return this._filter.getRaces().pipe(
          map((races) => FilterActions.saveRaces({ races, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              FilterActions.saveRaces({ races:[], error, status:EntityStatus.Loaded}),
            )
          })
        )
      })
    );
  });

  loadTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FilterActions.loadTypes),
      switchMap(() => {
        return this._filter.getTypes().pipe(
          map((types) => FilterActions.saveTypes({ types, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              FilterActions.saveTypes({ types:[], error, status:EntityStatus.Loaded}),
            )
          })
        )
      })
    );
  });



  // messageFailureAuth$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(FilterActions.loadMonstersFailure),
  //     tap(() => this.presentToast(this.translate.instant('ERRORS.ERROR_LOAD_MONSTER_CARDS'), 'danger')),
  //   ), { dispatch: false }
  // );

  tryLoadArchetypes = createEffect(() => {
    return of(
      FilterActions.loadArchetypes(),
    )
  });

  tryLoasAttributtes = createEffect(() => {
    return of(
      FilterActions.loadAttributes()
    )
  });

  tryLoadRaces = createEffect(() => {
    return of(
      FilterActions.loadRaces()
    )
  });

  tyLoadTypes = createEffect(() => {
    return of(
      FilterActions.loadTypes()
    )
  });


  constructor(
    private actions$: Actions,
    private _filter: FilterService,
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
