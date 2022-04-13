import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, ModalController, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CardModalComponent } from '@ygopro/shared-ui/generics/components/card-modal.component';
import { ModalFilterComponent } from '@ygopro/shared-ui/generics/components/modal-filter.component';
import { PopoverComponent } from '@ygopro/shared-ui/generics/components/poper.component';
import { CardActions, Filter, fromCard } from '@ygopro/shared/card';
import { fromFilter } from '@ygopro/shared/filter';
import { StorageActions } from '@ygopro/shared/storage';
import { emptyObject, errorImage, gotToTop, trackById } from '@ygopro/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/utils/models';
import { combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  template:`
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color-third">
        <!-- FORM  -->
        <form (submit)="searchSubmit($event)" class="fade-in-card">
          <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search"(ionClear)="clearSearch($event)"></ion-searchbar>
        </form>
      </div>

      <div class="container components-color-second">
        <ng-container *ngIf="(cards$ | async) as cards">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || statusComponent?.page !== 0; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">
                <ng-container *ngIf="cards?.length > 0; else noData">

                  <!-- FILTER  -->
                  <ng-container *ngIf="(filters$ | async) as filters">
                    <div class="width-84 margin-center margin-top displays-center">
                      <ion-button class="displays-center class-ion-button" (click)="presentModal(filters)">{{ 'COMMON.FILTERS' | translate }} <ion-icon name="options-outline"></ion-icon> </ion-button>
                    </div>
                  </ng-container>

                  <ng-container *ngFor="let card of cards; trackBy: trackById">
                    <ion-card class="ion-activatable ripple-parent" (click)="openSingleCardModal(card)" ion-long-press [interval]="400" (pressed)="presentPopover($event, card)">
                      <img [src]="getImgage(card?.card_images)" loading="lazy" (error)="errorImage($event)">

                      <ng-container *ngIf="emptyObject(card?.banlist_info)">
                        <div class="banlist-div">
                          <div *ngIf="!!card?.banlist_info?.ban_tcg" class="card-result span-bold font-medium">
                            <span [ngClass]="{'forbidden': card?.banlist_info?.ban_tcg === 'Banned', 'limited': card?.banlist_info?.ban_tcg === 'Limited', 'semi-limited': card?.banlist_info?.ban_tcg === 'Semi-Limited'}">{{ 'COMMON.TCG' | translate}}: </span>
                            <ng-container *ngIf="card?.banlist_info?.ban_tcg === 'Banned'"><img [src]="banned"/></ng-container>
                            <ng-container *ngIf="card?.banlist_info?.ban_tcg === 'Limited'"><img [src]="limited"/></ng-container>
                            <ng-container *ngIf="card?.banlist_info?.ban_tcg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                          </div>
                          <div *ngIf="!!card?.banlist_info?.ban_ocg" class="card-result span-bold font-medium">
                            <span [ngClass]="{'forbidden': card?.banlist_info?.ban_ocg === 'Banned', 'limited': card?.banlist_info?.ban_ocg === 'Limited', 'semi-limited': card?.banlist_info?.ban_ocg === 'Semi-Limited'}">{{ 'COMMON.OCG' | translate}}: </span>
                            <ng-container *ngIf="card?.banlist_info?.ban_ocg === 'Banned'"><img [src]="banned"/></ng-container>
                            <ng-container *ngIf="card?.banlist_info?.ban_ocg === 'Limited'"><img [src]="limited"/></ng-container>
                            <ng-container *ngIf="card?.banlist_info?.ban_ocg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                          </div>
                        </div>
                      </ng-container>

                      <!-- RIPPLE EFFECT  -->
                      <ion-ripple-effect></ion-ripple-effect>
                    </ion-card>
                  </ng-container>

                  <!-- INFINITE SCROLL  -->
                  <ng-container *ngIf="(total$ | async) as total">
                    <ng-container *ngIf="(statusComponent?.page + 21) < total">
                      <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                        <ion-infinite-scroll-content class="loadingspinner">
                          <ion-spinner *ngIf="$any(status) === 'pending'" class="loadingspinner"></ion-spinner>
                        </ion-infinite-scroll-content>
                      </ion-infinite-scroll>
                    </ng-container>
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
  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;

  banned = '../../../assets/images/Banned.png';
  limited = '../../../assets/images/Limited.png';
  semiLimited = '../../../assets/images/Semi-limited.png';

  showButton: boolean = false;
  perPageSum: number = 21;
  search = new FormControl('');

  status$ = this.store.select(fromCard.getStatus);
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
  loadData(event, total) {
    setTimeout(() => {
      this.statusComponent = {...this.statusComponent, page:(this.statusComponent?.page + this.perPageSum) };

      if(this.statusComponent?.page >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }
      console.log(this.statusComponent)
      this.infiniteScroll$.next(this.statusComponent)
      event.target.complete();
    }, 500);
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

  async presentPopover(ev: any, info: Card) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
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
