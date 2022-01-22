import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { fromSet } from '@ygopro/shared/set';
import { gotToTop, sliceTestLong, trackById, emptyObject, getObjectKeys } from '@ygopro/shared/shared/utils/helpers/functions';
import { tap, startWith, switchMap, map } from 'rxjs/operators';
import SwiperCore, { Navigation, Pagination, SwiperOptions } from 'swiper';
// Pagination
SwiperCore.use([ Navigation]);


@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="empty-header components-color-third"></div>

      <div class="container components-color-second">

        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <div class="header margin-top">
                <h2 class="text-second-color">{{ 'COMMON.LAST_SETS' | translate }}</h2>
              </div>

              <ng-container *ngIf="lastSets$ | async as lastSets">
                <ng-container *ngIf="lastSets?.length > 0; else noData">

                  <swiper #swiper effect="fade" [config]="getSliderConfig(lastSets)" >
                    <ng-template swiperSlide *ngFor="let set of lastSets; trackBy: trackById" >
                    <!-- [routerLink]="['/cards/'+set?.id]" [queryParams]="{name:set?.name}" -->
                      <ion-card class="slide-ion-card" >
                        <ion-card-header >
                          <span class="big-size-medium span-bold">{{ sliceTestLong(set?.set_name) }}</span>
                        </ion-card-header>
                        <ion-card-content>
                          <p class="font-medium text-center">{{ set?.tcg_date }}</p>
                        </ion-card-content>
                      </ion-card>
                    </ng-template>
                  </swiper>

                </ng-container>
              </ng-container>

              <ng-container *ngIf="(info$ | async) as info">
                <ng-container *ngIf="emptyObject(info?.sets); else noData">

                  <ng-container *ngFor="let key of getObjectKeys(info?.sets); trackBy: trackById">

                    <div class="header" no-border>
                      <h2 class="text-second-color"> <span *ngIf="key !== 'Promotion'">{{ 'COMMON.YEAR' | translate }}</span> {{ key }}</h2>
                    </div>

                    <swiper #swiper effect="fade" [config]="getSliderConfig(info?.sets[key])" >
                      <ng-template swiperSlide *ngFor="let set of info?.sets[key]; trackBy: trackById" >
                      <!-- [routerLink]="['/cards/'+set?.id]" [queryParams]="{name:set?.name}" -->
                        <ion-card class="slide-ion-card" >
                          <ion-card-header >
                            <span class="big-size-medium span-bold">{{ sliceTestLong(set?.set_name) }}</span>
                          </ion-card-header>
                          <ion-card-content>
                            <p class="font-medium text-center">{{ set?.tcg_date }}</p>
                          </ion-card-content>
                        </ion-card>
                      </ng-template>
                    </swiper>
                  </ng-container>

                  <!-- INFINITE SCROLL  -->
                  <ng-container *ngIf="statusComponent?.slice < info?.total">
                    <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, info?.total)">
                      <ion-infinite-scroll-content class="loadingspinner">
                      </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                  </ng-container>

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
          <div class="error-serve">
            <div>
              <span><ion-icon class="text-second-color big-size" name="cloud-offline-outline"></ion-icon></span>
              <br>
              <span class="text-second-color">{{'COMMON.ERROR' | translate}}</span>
            </div>
          </div>
        </ng-template>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <div class="error-serve heigth-mid">
            <div>
              <span><ion-icon class="text-second-color max-size" name="clipboard-outline"></ion-icon></span>
              <br>
              <span class="text-second-color">{{'COMMON.NORESULT' | translate}}</span>
            </div>
          </div>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <ion-spinner class="loadingspinner"></ion-spinner>
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
  getObjectKeys = getObjectKeys;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  showButton: boolean = false;

  status$ = this.store.select(fromSet.getStatus);
  lastSets$ = this.store.select(fromSet.getLastSets);

  infiniteScroll$ = new EventEmitter<{slice:number}>();
  statusComponent: {slice: number} = {slice: 2};

  info$ = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    switchMap(({slice}) =>
      this.store.select(fromSet.getSets).pipe(
        map(allSets => {
          return (allSets || [])?.reduce((acc, el) => {
            const { tcg_date = null } = el || {};
            const year = tcg_date?.split('-')[0] || 'Promotion';
            return {
              ...(acc ? acc : {}),
              [year]:[
                ...(acc?.[year] ? acc?.[year] : []),
                ...(el ? [el]: [])
              ]
            }
          },{});
        }),
        map((objSet) => {
          return {
            sets: Object.entries(objSet || {})?.slice(0, slice).reduce((acc, el) => {
              const [ key = null, values = null ] = el || [];
              return {
                ...(acc ? acc : {}),
                [key]:[
                  ...(acc?.[key] ? acc?.[key] : []),
                  ...(values ? (values as any) : [])
                ]
              }
            },{}),
            total: Object?.keys(objSet || {})?.length
          }
        })
        // ,tap(d => console.log(d))
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
      this.statusComponent = {...this.statusComponent, slice: 2};
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
  loadData(event, total) {
    setTimeout(() => {
      this.statusComponent = { slice: this.statusComponent?.slice + 2 };

      if(this.statusComponent?.slice >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }

      this.infiniteScroll$.next(this.statusComponent);
      event.target.complete();
    }, 500);
  }

  // SLIDES CONFIG
  getSliderConfig(info:any): SwiperOptions {
    return {
      // initialSlide: 0,
      // speed: 400,
      // slidesOffsetBefore: info?.length,
      slidesPerView: info?.length > 1 ? 2 : 1,
      spaceBetween: 30,
      freeMode: true,
      pagination:{   clickable: true },

      // effect:'coverflow',
      // coverflowEffect:{
      //   rotate: 50,
      //   stretch: 0,
      //   depth: 100,
      //   modifier: 1,
      //   slideShadows: true
      // }
    };
  }

}
