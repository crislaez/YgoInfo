import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, ModalController, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CardModalComponent } from '@ygopro/shared-ui/card-modal/card-modal.component';
import { ModalFilterComponent } from '@ygopro/shared-ui/modal-filter/modal-filter.component';
import { PopoverComponent } from '@ygopro/shared-ui/popover/poper.component';
import { CardActions, Filter, fromCard } from '@ygopro/shared/card';
import { fromFilter } from '@ygopro/shared/filter';
import { Card } from '@ygopro/shared/models';
import { StorageActions } from '@ygopro/shared/storage';
import { gotToTop } from '@ygopro/shared/utils/functions';
import { combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  template:`
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color-third displays-center">
        <ng-container *ngIf="!['pending','error']?.includes(status$ | async)">
          <!-- FORM  -->
          <form (submit)="searchSubmit($event)">
            <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search"(ionClear)="clearSearch($event)"></ion-searchbar>
          </form>
          <!-- FILTER  -->
          <ion-button *ngIf="(filters$ | async) as filters" class="displays-center class-ion-button" (click)="presentModal(filters)"><ion-icon name="options-outline"></ion-icon> </ion-button>
        </ng-container>
      </div>

      <div class="container components-color-second">
        <ng-container *ngIf="(cards$ | async) as cards">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || statusComponent?.page !== 0; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">
                <ng-container *ngIf="cards?.length > 0; else noData">

                  <app-search-list
                    [items]="cards"
                    (openSingleCardModal)="openSingleCardModal($event)"
                    (presentPopoverTrigger)="presentPopover($event)">
                  </app-search-list>

                  <!-- INFINITE SCROLL  -->
                  <app-infinite
                    [slice]="cards?.length"
                    [status]="status"
                    [total]="(total$ | async)"
                    (loadDataTrigger)="loadData($event)">
                  </app-infinite>

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
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage {

  gotToTop = gotToTop;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;

  showButton: boolean = false;
  perPageSum: number = 21;
  search = new FormControl('');

  status$ = this.store.select(fromCard.getStatus).pipe(shareReplay(1));
  total$ = this.store.select(fromCard.getTotalCount);

  filters$ = combineLatest([
    this.store.select(fromFilter.getFormats),
    this.store.select(fromFilter.getTypes),
    this.store.select(fromFilter.getArchetypes)
  ]).pipe(
    map(([cardFormat, cardType, archetype]) => ({cardFormat, cardType, archetype})),
  );

  infiniteScroll$ = new EventEmitter<{page:number, filter: Filter}>();
  statusComponent: {page: number, filter: Filter} = {
    page: 0,
    filter: {}
  };

  cards$ = this.infiniteScroll$.pipe(
    tap(({page, filter}) => {
      this.store.dispatch(CardActions.loadCards({page, filter}))
    }),
    switchMap(() =>
      this.store.select(fromCard.getCards)
    )
    // ,tap((data) => console.log(data))
  );


  constructor(
    private store: Store,
    public platform: Platform,
    public popoverController: PopoverController,
    public modalController: ModalController
  ) { }


  ionViewWillEnter(): void{
    this.search.reset();
    this.statusComponent = { page:0, filter:{} };
    this.infiniteScroll$.next(this.statusComponent);
  }

  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {...this.statusComponent, filter:{ fname:this.search.value }, page:0 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {...this.statusComponent, filter:{ fname: ''}, page:0 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    this.statusComponent = {...this.statusComponent, page:(this.statusComponent?.page + this.perPageSum) };

    if(this.statusComponent?.page >= total){
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
    }
    console.log(this.statusComponent)
    this.infiniteScroll$.next(this.statusComponent)
    event.target.complete();
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.statusComponent = { page: 0, filter:{} };
      this.infiniteScroll$.next(this.statusComponent);
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
  async presentModal( filters ) {
    const { cardFormat = null, cardType = null, archetype = null } = filters || {};

    const modal = await this.modalController.create({
      component: ModalFilterComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        statusComponent: this.statusComponent,
        cardType,
        cardFormat,
        archetype
      },
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.4, //modal height
    });

    modal.onDidDismiss()
      .then((res) => {
        const { data } = res || {};

        if(!!data){
          this.statusComponent = { ...data }
          this.infiniteScroll$.next(this.statusComponent)
          if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
        }
    });

    return await modal.present();
  }

  getImgage(card_images: any[]): string{
    return card_images?.[0]?.image_url_small || card_images?.[0]?.image_url;
  }

}
