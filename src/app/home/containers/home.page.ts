import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonContent, IonInfiniteScroll, ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { fromSet, Set } from '@ygopro/shared/set';
import { emptyObject, gotToTop } from '@ygopro/shared/utils/helpers/functions';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { Keyboard } from '@capacitor/keyboard';
import { ModalFilterComponent } from '@ygopro/shared-ui/generics/components/modal-filter.component';

@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color-third">
        <!-- FORM  -->
        <form *ngIf="['loaded']?.includes(status$ | async)" (submit)="searchSubmit($event)" class="fade-in-card">
          <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
        </form>
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
                <div class="header margin-top">
                  <h2 class="text-second-color">{{ 'COMMON.ALL_SETS' | translate }}</h2>
                </div>

                <!-- FILTER  -->
                <div class="width-84 margin-center displays-center">
                  <ion-button class="displays-center class-ion-button" (click)="presentModal(orderFilter)">{{ 'COMMON.FILTERS' | translate }} <ion-icon name="options-outline"></ion-icon> </ion-button>
                </div>

                <ng-container *ngIf="emptyObject(info?.sets); else noData">
                  <!-- INFINITE SCROLL  -->
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
  emptyObject = emptyObject;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  showButton: boolean = false;
  search = new FormControl('');
  orderFilter = ['ascending', 'descending']
  status$ = this.store.select(fromSet.getStatus);
  lastSets$ = this.store.select(fromSet.getLastSets);

  infiniteScroll$ = new EventEmitter<{ slice:number, filter?:{name?:string, order?:string} }>();
  statusComponent: { slice: number, filter?:{name?:string, order:string} } = {
    slice: 20,
    filter:{
      name:'',
      order:'descending'
    }
  };

  info$ = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    switchMap(({slice, filter}) =>
      this.store.select(fromSet.getSets).pipe(
        map((allSets) => {
          const { name = null, order = null } = filter || {};

          const allSetOrder = order
            ? this.orderFilterByDate(allSets, order)
            : [...allSets];

          const allSetsFilter = name
            ? (allSetOrder || [])?.filter(({set_name}) => set_name?.toLowerCase()?.includes(name?.toLowerCase()))
            : [...allSetOrder];

          return {
            sets: allSetsFilter?.slice(0, slice),
            total: allSetsFilter?.length
          }
        })
      )
    )
    // ,tap(d => console.log(d))
  );


  constructor(
    private store: Store,
    public platform: Platform,
    public modalController: ModalController
  ) { }


  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {...this.statusComponent, filter:{ ...this.statusComponent.filter, name:this.search.value }, slice: 20 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {...this.statusComponent, filter:{ ...this.statusComponent.filter, name:'' }, slice: 20 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.statusComponent = {...this.statusComponent, slice: 20, filter:{order:'descending'}};
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    this.statusComponent = { ...this.statusComponent, slice: this.statusComponent?.slice + 20 };

    if(this.statusComponent?.slice >= total){
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
    }

    this.infiniteScroll$.next(this.statusComponent);
    event.target.complete();
  }

  // OPEN FILTER MODAL
  async presentModal( orderFilter ) {
    const modal = await this.modalController.create({
      component: ModalFilterComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        statusComponent: this.statusComponent,
        orderFilter,
        showTypesFilter:false
      },
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.4, //modal height
    });

    modal.onDidDismiss()
      .then((res) => {
        const { data } = res || {};

        if(!!data){
          this.statusComponent = { ...data, slice:20 }
          this.infiniteScroll$.next(this.statusComponent)
          if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
        }
    });

    return await modal.present();
  }

  orderFilterByDate(sets: Set[], order:string): Set[]{
    return [...sets]?.sort((a,b) => {
      const firstItem = (order === 'descending') ? {...b}: {...a};
      const secondItem = (order === 'descending') ? {...a}: {...b};

      if(new Date(firstItem.tcg_date).getTime() > new Date(secondItem.tcg_date).getTime()) return 1
      if(new Date(firstItem.tcg_date).getTime() < new Date(secondItem.tcg_date).getTime()) return -1
      return 0
    });
  }
  // const sortedSets = [...sets]?.sort((a,b) => {
  //   if(new Date(a.tcg_date).getTime() > new Date(b.tcg_date).getTime()) return 1
  //   if(new Date(a.tcg_date).getTime() < new Date(b.tcg_date).getTime()) return -1
  //   return 0
  // });

}
