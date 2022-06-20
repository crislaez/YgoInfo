import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { BanlistActions, fromBanlist } from '@ygopro/shared/banlist';
import { gotToTop, trackById } from '@ygopro/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/utils/models';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { CardModalComponent } from './../../shared-ui/generics/components/card-modal.component';

@Component({
  selector: 'app-banlist',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color-third displays-center">
        <!-- FORM  -->
        <form *ngIf="['loaded']?.includes(status$ | async)" (submit)="searchSubmit($event)">
          <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search"(ionClear)="clearSearch($event)"></ion-searchbar>
        </form>
      </div>

      <div class="container components-color-second">
        <div class="empty-header-mid"></div>

        <ng-container *ngIf="(banlist$ | async) as banlist">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending'; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">

                <ion-segment (ionChange)="segmentChanged($event)" [(ngModel)]="selected">
                  <ion-segment-button *ngFor="let ban of banlistType; trackBy: trackById" [value]="ban?.type">
                    <ion-label>{{ ban?.type }}</ion-label>
                  </ion-segment-button>
                </ion-segment>

                <ng-container *ngIf="banlist?.banlist?.length > 0; else noData">
                  <app-banlist-list
                    [items]="banlist?.banlist"
                    [banlistType]="componentStatus?.banlistType"
                    (openSingleCardModal)="openSingleCardModal($event)">
                  </app-banlist-list>

                  <!-- INFINITE SCROLL  -->
                  <app-infinite
                    [slice]="banlist?.banlist?.length"
                    [status]="status"
                    [total]="banlist?.total"
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
  styleUrls: ['./banlist.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BanlistPage {

  gotToTop = gotToTop;
  trackById = trackById;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent
  infiniteScroll$ = new EventEmitter<{banlistType: string, perPage: number, search:string}>();
  showButton: boolean = false;
  selected = '';
  banlistType = [
    { id:1, type: 'tcg' },
    { id:2, type: 'ocg' }
  ];
  search = new FormControl('');

  componentStatus: {banlistType: string, perPage: number, search:string} = {
    banlistType: 'tcg',
    perPage: 20,
    search:''
  };

  status$ = this.store.select(fromBanlist.getStatus).pipe(shareReplay(1));

  banlist$ = this.infiniteScroll$.pipe(
    startWith(this.componentStatus),
    tap(({ banlistType, perPage }) => {
      if(perPage === 20){
        this.store.dispatch(BanlistActions.loadBanlist({banlistType}));
      }
    }),
    switchMap(({perPage, search}) =>
      this.store.select(fromBanlist.getBanlist).pipe(
        map(banlist => {
          const updateBanlist = search
                ? banlist?.filter(({name}) => name?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()))
                : banlist;
          return {
            banlist: updateBanlist?.slice(0, perPage),
            total: updateBanlist?.length
          }
        })
      )
    )
    // ,tap(d => console.log(d))
  );


  constructor(
    private store: Store,
    public modalController: ModalController,
    public platform: Platform,
  ) {
    this.selected = this.banlistType?.[0]?.type;
  }


  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.componentStatus = {...this.componentStatus, search:this.search.value, perPage: 20 };
    this.infiniteScroll$.next(this.componentStatus);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.componentStatus = {...this.componentStatus, search:this.search.value, perPage: 20 };
    this.infiniteScroll$.next(this.componentStatus);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    this.componentStatus = {...this.componentStatus, perPage: this.componentStatus.perPage + 20};

    if(this.componentStatus?.perPage >= total){
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
    }

    this.infiniteScroll$.next(this.componentStatus)
    event.target.complete();
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.componentStatus = {...this.componentStatus, perPage: 20, search:''};
      this.infiniteScroll$.next(this.componentStatus)
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }

  segmentChanged(event): void{
    const { detail:{value = ''} } = event || {};
    this.search.reset();
    this.componentStatus = { ...this.componentStatus, banlistType: value, perPage: 20, search:''};
    this.infiniteScroll$.next(this.componentStatus);
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

  getImgage(card_images: any[]): string{
    return card_images?.[0]?.image_url_small || card_images?.[0]?.image_url;
  }



}
