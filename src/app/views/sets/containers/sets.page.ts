import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ModalFilterComponent } from '@ygopro/shared-ui/modal-filter/modal-filter.component';
import { Filter } from '@ygopro/shared/card';
import { fromSet, SetActions } from '@ygopro/shared/set';
import { Set, SetFilter } from '@ygopro/shared/set/models';
import { appColors, getLastNumber, gotToTop, trackById } from '@ygopro/shared/utils/functions';
import { map, switchMap, tap, startWith } from 'rxjs/operators';

export interface SetsComponentStatus {
  slice?:number;
  filter?:SetFilter;
  refresh?: boolean;
};

@Component({
  selector: 'ygopro-sets',
  template:`
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header textColor displays-center margin-top-25">
        <!-- FORM  -->
        <form (submit)="searchSubmit($event)">
          <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
        </form>
        <!-- FILTER  -->
        <ion-button *ngIf="yearsFilter?.length > 0 as filters" class="displays-center class-ion-button" (click)="presentModal(yearsFilter)"> <ion-icon name="options-outline"></ion-icon> </ion-button>
      </div>

      <div class="container textColor">

        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending'; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">
                <ng-container *ngIf="info?.sets?.length > 0; else noData">

                  <ygopro-generic-card
                    *ngFor="let set of info?.sets; let i = index; trackBy: trackById"
                    [item]="set"
                    [backgroundColor]="appColors?.[getLastNumber(i)]"
                    [from]="'set'">
                  </ygopro-generic-card>

                  <!-- INFINITE SCROLL  -->
                  <ygopro-infinite
                    [status]="status"
                    [slice]="info?.sets?.length"
                    [total]="info?.total"
                    (loadDataTrigger)="loadData($event)">
                  </ygopro-infinite>

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
  styleUrls: ['./sets.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetsPage {

  gotToTop = gotToTop;
  appColors = appColors;
  trackById = trackById;
  getLastNumber = getLastNumber;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  showButton: boolean = false;
  search = new FormControl('');
  slice = 14;


  status$ = this.store.select(fromSet.getStatus);
  trigger = new EventEmitter<SetsComponentStatus>();
  statusComponent: SetsComponentStatus = {
    slice:this.slice,
    filter:{},
    refresh: false
  };
  info$ = this.trigger.pipe(
    startWith(this.statusComponent),
    tap(({refresh}) => {
      if(!!refresh){
        this.store.dispatch(SetActions.loadSets())
      }
    }),
    switchMap(({slice, filter}) =>
      this.store.select(fromSet.getSets).pipe(
        map(sets => {
          const { search = null, year = null} = filter || {};
          const filteredSets = !search && !year
                              ? sets
                              : this.filterSets(sets, filter)
          return {
            sets: filteredSets?.slice(0, slice),
            total: filteredSets?.length
          }
        })
      )
    )
    // ,tap(d => console.log(d))
  );


  constructor(
    private store: Store,
    public platform: Platform,
    public modalController: ModalController,
  ) {  }


  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {
      ...this.statusComponent,
      slice: this.slice,
      filter:{
        ...this.statusComponent.filter,
        search: this.search.value
      },
      refresh: false,
    };

    this.trigger.next(this.statusComponent);
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {
      ...this.statusComponent,
      slice: this.slice,
      filter:{
        ...this.statusComponent.filter,
        search: null
      },
      refresh: false,
    };

    this.trigger.next(this.statusComponent);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.statusComponent = {
        slice: this.slice,
        filter:{},
        refresh: true,
      };
      this.trigger.next(this.statusComponent);
      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    setTimeout(() => {
      this.statusComponent = {
        ...this.statusComponent,
        slice: this.statusComponent?.slice + this.slice,
        refresh: false,
      };
      this.trigger.next(this.statusComponent);
      event.target.complete();
    },500)
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // OPEN FILTER MODAL
  async presentModal(yearFilter: string[]) {
    const modal = await this.modalController.create({
      component: ModalFilterComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        statusComponent: this.statusComponent,
        yearFilter,
        bool: true
      },
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.2,
    });

    modal.present();

    const { data = null } = await modal.onDidDismiss();
    if(!data || Object.keys(data || {})?.length === 0) return;

    this.statusComponent = { ...data, refresh:false };
    this.trigger.next(this.statusComponent)
  }

  get yearsFilter(): string [] {
    const lastSetYear = 2001;
    const actualYear = new Date()?.getFullYear(); //2022
    return new Array((actualYear - lastSetYear))?.fill(lastSetYear)?.map((item, index) => {
      return (item + index)?.toString()
    })?.concat(actualYear?.toString())
  }

  filterSets(sets: Set[], filter: SetFilter): Set[] {
    let filterSets = sets || [];
    const { search = null, year = null} = filter || {};

    if(search){
      filterSets = (filterSets || [])?.filter(({set_name}) => set_name?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()));
    }

    if(year){
      filterSets = (filterSets || [])?.filter(({tcg_date}) => tcg_date?.includes(year));
    }

    return filterSets
  }


}
