import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EntityStatus } from '@ygopro/shared/utils/helpers/functions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
    )
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
    )
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
    )
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
    )
  });

  loadFormats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FilterActions.loadFormats),
      switchMap(() => {
        return this._filter.getFormat().pipe(
          map((formats) => FilterActions.saveFormats({ formats, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              FilterActions.saveFormats({ formats:[], error, status:EntityStatus.Loaded}),
            )
          })
        )
      })
    )
  });

  loadLevels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FilterActions.loadLevels),
      switchMap(() => {
        return this._filter.getLevel().pipe(
          map((levels) => FilterActions.saveLevels({ levels, error:undefined, status:EntityStatus.Loaded })),
          catchError(error => {
            return of(
              FilterActions.saveLevels({ levels:[], error, status:EntityStatus.Loaded}),
            )
          })
        )
      })
    );
  });

  tryLoadArchetypes = createEffect(() => {
    return of(
      FilterActions.loadArchetypes(),
      FilterActions.loadAttributes(),
      FilterActions.loadRaces(),
      FilterActions.loadTypes(),
      FilterActions.loadFormats(),
      FilterActions.loadLevels()
    )
  });


  constructor(
    private actions$: Actions,
    private _filter: FilterService,
    public toastController: ToastController,
  ) { }



}
