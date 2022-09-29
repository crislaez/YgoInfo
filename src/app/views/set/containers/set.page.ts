import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, ModalController, Platform, PopoverController } from '@ionic/angular';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CardModalComponent } from '@ygopro/shared-ui/card-modal/card-modal.component';
import { ModalFilterComponent } from '@ygopro/shared-ui/modal-filter/modal-filter.component';
import { PopoverComponent } from '@ygopro/shared-ui/popover/poper.component';
import { CardActions, Filter, fromCard } from '@ygopro/shared/card';
import { Card } from '@ygopro/shared/models';
import { StorageActions } from '@ygopro/shared/storage';
import { appColors, errorImage, getLastNumber, gotToTop, trackById } from '@ygopro/shared/utils/functions';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import * as fromSet from '../selectors/set.selectors';

export interface SetComponentStatus {
  setName?: string;
  page?:number;
  filter?: Filter;
  refresh?: boolean;
};

@Component({
  selector: 'ygopro-set',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color displays-center margin-top-25">
        <ng-container *ngIf="!['pending']?.includes(status$ | async)">
          <!-- FORM  -->
          <form (submit)="searchSubmit($event)">
            <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search"(ionClear)="clearSearch($event)"></ion-searchbar>
          </form>
           <!-- FILTER  -->
          <ion-button *ngIf="(filters$ | async) as filters" class="displays-center class-ion-button" (click)="presentModal(filters)"> <ion-icon name="options-outline"></ion-icon> </ion-button>
        </ng-container>
      </div>

      <div class="container components-color">

        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || statusComponent?.page !== 0; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">
                <ng-container *ngIf="info?.cards?.length > 0; else noData">

                  <ygopro-card-component
                    *ngFor="let card of info?.cards; let i = index; trackBy: trackById"
                    [card]="card"
                    [isSetName]="info?.setName"
                    [from]="'set'"
                    (openSingleCardModal)="openSingleCardModal($event)"
                    (presentPopoverTrigger)="presentPopover($event)">
                  </ygopro-card-component>

                  <!-- INFINITE SCROLL  -->
                  <ygopro-infinite
                    [slice]="info?.cards?.length"
                    [status]="status"
                    [total]="info?.total"
                    (loadDataTrigger)="loadData($event, info?.page)">
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
          <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'30vh'"></app-no-data>
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
  styleUrls: ['./set.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetPage {

  gotToTop = gotToTop;
  trackById = trackById;
  appColors = appColors;
  errorImage = errorImage;
  getLastNumber = getLastNumber;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  title: string;
  showButton: boolean = false;
  perPageSum: number = 22;
  search = new FormControl('');

  filters$ = this.store.select(fromSet.setSelectors);
  status$ = this.route.params.pipe(
    switchMap(({setName}) =>
      this.store.select(fromCard.selectSetCardsStatus(setName))
    )
    ,shareReplay(1)
  );

  trigger = new EventEmitter<SetComponentStatus>();
  statusComponent:SetComponentStatus = {};

  info$ = this.trigger.pipe(
    concatLatestFrom(() => this.store.select(fromCard.selectAllSetsCards)),
    tap(([{setName, page, filter, refresh}, setCardList]) => {

      if(!refresh){
        const { filter: storeFilter = null } = setCardList?.[setName] || {};
        const { fname = null, type = null } = storeFilter || {};
        this.search.setValue(fname);
        this.statusComponent = {
          ...this.statusComponent,
          filter:{
            ...this.statusComponent?.filter,
            ...(fname ? {fname} : {}),
            ...(type ? {type} : {})
          }
        }
      }

      if(!setCardList?.[setName] || page > 0 || !!refresh){
        this.store.dispatch(CardActions.loadSetCards({setName, page, filter}))
      }
    }),
    switchMap(([{setName}]) =>
      this.store.select(fromCard.selectSetCards(setName)).pipe(
        concatLatestFrom(() => [
          this.store.select(fromCard.selectSetCardTotalCount(setName)),
          this.store.select(fromCard.selectSetCardTPage(setName))
        ]),
        map(([cards = [], total = 0, page = 0]) => ({cards, total, page, setName}))
      )
    )
  );


  constructor(
    private store: Store,
    public platform: Platform,
    private route: ActivatedRoute,
    public modalController: ModalController,
    public popoverController: PopoverController,
  ) {
    this.title = this.route.snapshot.params?.setName || ''
  }


  ionViewWillEnter(): void{
    this.search.reset();
    const setName = this.route.snapshot.params?.setName || '';
    this.statusComponent = {
      setName,
      page:0,
      filter:{
        cardset: setName
      },
      refresh: false
    };
    this.trigger.next(this.statusComponent);
  }

  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {
      ...this.statusComponent,
      filter:{
        ...(this.statusComponent?.filter ?? {}),
        fname:this.search.value,
      },
      page:0,
      refresh: true
    };
    this.trigger.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {
      ...this.statusComponent,
      filter:{
        ...(this.statusComponent?.filter ?? {}),
        fname: '',
      },
      page:0,
      refresh: true
    };
    this.trigger.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // INIFINITE SCROLL
  loadData({event, total}, statusPage: number) {
    this.statusComponent = {
      ...this.statusComponent,
       page: (statusPage + this.perPageSum),//(this.statusComponent?.page + this.perPageSum),
       refresh: false
    };
    this.trigger.next(this.statusComponent);
    event.target.complete();
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.statusComponent = {
        ...this.statusComponent,
        page: 0,
        filter:{
          cardset: this.route.snapshot.params?.setName || ''
        },
        refresh: true
      };
      this.trigger.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }

  async presentPopover({event, info}) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: event,
      translucent: true,
      componentProps:{
        button:'save'
      }
    });
    await popover.present();

    const { role, data } = await popover.onDidDismiss();
    if(data) this.store.dispatch(StorageActions.saveCard({card:info}))
  }

  // SHOW SINGLE CARD
  async openSingleCardModal(card: Card) {
    const modal = await this.modalController.create({
      component: CardModalComponent,
      componentProps:{
        card
      }
    });

    return await modal.present();
  }

  // OPEN FILTER MODAL
  async presentModal(filters) {
    const { cardFormat = null, cardType = null } = filters || {};

    const modal = await this.modalController.create({
      component: ModalFilterComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        statusComponent: this.statusComponent,
        cardType,
        cardFormat,
        bool: true
      },
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.2,
    });

    modal.present();

    const { data = null } = await modal.onDidDismiss();
    if(!data || Object.keys(data || {})?.length === 0) return;

    this.statusComponent = { ...data, refresh:true };
    this.trigger.next(this.statusComponent)
  }


}
