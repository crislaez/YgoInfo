import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { fromSet } from '@ygopro/shared/set';
import { emptyObject, gotToTop, sliceTestLong, trackById } from '@ygopro/shared/utils/helpers/functions';
import { map, startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="empty-header components-color-third">
      </div>

      <div class="container components-color-second">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <!-- LAST SETS  -->
              <ng-container *ngIf="lastSets$ | async as lastSets">
                <ng-container *ngIf="lastSets?.length > 0; else noData">
                  <div class="header margin-top">
                    <h2 class="text-second-color">{{ 'COMMON.LAST_SETS' | translate }}</h2>
                  </div>

                  <app-swiper
                    [items]="lastSets">
                  </app-swiper>
                </ng-container>
              </ng-container>

              <!-- ALL SETS  -->
              <ng-container *ngIf="(info$ | async) as info">
                <ng-container *ngIf="emptyObject(info?.sets); else noData">
                  <div class="header margin-top">
                    <h2 class="text-second-color">{{ 'COMMON.ALL_SETS' | translate }}</h2>
                  </div>

                  <app-infinite-scroll
                    [from]="'home'"
                    [page]="statusComponent?.slice"
                    [total]="info?.total"
                    [items]="info?.sets"
                    [status]="status"
                    (loadDataTrigger)="loadData($event)">
                  </app-infinite-scroll>
                </ng-container>
              </ng-container>

            </ng-container>
          </ng-container>
        </ng-container>


        <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <!-- IS ERROR -->
        <ng-template #serverError>
          <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'30vh'"></app-no-data>
        </ng-template>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'20vh'"></app-no-data>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <app-spinner [top]="'80%'"></app-spinner>
        </ng-template>
      </div>

      <!-- TO TOP BUTTON  -->
      <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  gotToTop = gotToTop;
  trackById = trackById;
  emptyObject = emptyObject;
  sliceTestLong = sliceTestLong;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  showButton: boolean = false;

  status$ = this.store.select(fromSet.getStatus);
  lastSets$ = this.store.select(fromSet.getLastSets);

  infiniteScroll$ = new EventEmitter<{slice:number}>();
  statusComponent: {slice: number} = {slice: 20};

  info$ = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    switchMap(({slice}) =>
      this.store.select(fromSet.getSets).pipe(
        map((allSets) => {
          return {
            sets: allSets?.slice(0, slice),
            total: allSets?.length
          }
        })
      )
    )
  );


  constructor(
    private store: Store
  ) { }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.statusComponent = {...this.statusComponent, slice: 20};
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    this.statusComponent = { slice: this.statusComponent?.slice + 20 };

    if(this.statusComponent?.slice >= total){
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
    }

    this.infiniteScroll$.next(this.statusComponent);
    event.target.complete();
  }



}
