import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, ModalController, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CardModalComponent } from '@ygopro/shared-ui/card-modal/card-modal.component';
import { PopoverComponent } from '@ygopro/shared-ui/popover/poper.component';
import { BanlistActions, fromBanlist } from '@ygopro/shared/banlist';
import { Card } from '@ygopro/shared/models';
import { StorageActions } from '@ygopro/shared/storage';
import { EntityStatus, gotToTop, trackById } from '@ygopro/shared/utils/functions';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

export interface BanlistComponentStatus {
  banlistType?: string,
  slice?: number,
  search?: string,
  reload?: string
};

@Component({
  selector: 'ygopro-banlist',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header text-color">
        <div class="empty-div-50"> </div>

        <h1 class="padding-top-10">{{ 'COMMON.BANLIST' | translate }}
        </h1>

        <div class="displays-center">
          <!-- FORM  -->
          <form *ngIf="['loaded']?.includes(status$ | async)" (submit)="searchSubmit($event)">
            <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search"(ionClear)="clearSearch($event)"></ion-searchbar>
          </form>
          <!-- FILTER  -->
          <ion-button class="displays-center class-ion-button" ></ion-button>
        </div>
      </div>

      <div class="container components-color-second">
        <ng-container *ngIf="(banlist$ | async) as banlist">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending'; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">

                <ion-segment (ionChange)="segmentChanged($event)" [(ngModel)]="selected">
                  <ion-segment-button
                    *ngFor="let ban of banlistType; trackBy: trackById"
                    [value]="ban?.type">
                    <ion-label class="span-bold">{{ ban?.type }}</ion-label>
                  </ion-segment-button>
                </ion-segment>

                <ng-container *ngIf="banlist?.banlist?.length > 0; else noData">
                  <div class="empty-div">
                  </div>

                  <ygopro-card-component
                    *ngFor="let card of banlist?.banlist; let i = index; trackBy: trackById"
                    [card]="card"
                    [isSetName]="null"
                    [from]="'banlist'"
                    [banlistType]="selected"
                    (openSingleCardModal)="openSingleCardModal($event)"
                    (presentPopoverTrigger)="presentPopover($event)">
                  </ygopro-card-component>

                  <!-- INFINITE SCROLL  -->
                  <ygopro-infinite
                    [slice]="banlist?.banlist?.length"
                    [status]="status"
                    [total]="banlist?.total"
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
  showButton: boolean = false;
  selected = '';
  slice = 20;
  search = new FormControl('');
  banlistType = [
    { id:1, type: 'tcg' },
    { id:2, type: 'ocg' }
  ];

  status$: Observable<EntityStatus>;
  trigger = new EventEmitter<BanlistComponentStatus>();
  componentStatus: BanlistComponentStatus;

  banlist$ = this.trigger.pipe(
    tap(({ reload  }) => {
      if(reload === 'tcg'){
        this.store.dispatch(BanlistActions.loadTCGBanlist());
      }
      if(reload === 'ocg'){
        this.store.dispatch(BanlistActions.loadOCGBanlist());
      }
    }),
    switchMap(({banlistType, slice, search}) => {
      const storeBanlist$ = banlistType === 'tcg'
                          ? this.store.select(fromBanlist.selectBanlistTCG)
                          : this.store.select(fromBanlist.selectBanlistOCG);

      return storeBanlist$.pipe(
        map(banlist => {
          const updateBanlist = search
                ? (banlist || [])?.filter(({name}) => name?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()))
                : banlist;
          return {
            banlist: updateBanlist?.slice(0, slice),
            total: updateBanlist?.length
          }
        })
      )
    })
    // ,tap(d => console.log(d))
  );


  constructor(
    private store: Store,
    public platform: Platform,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) {
    this.selected = this.banlistType?.[0]?.type;
  }


  ionViewWillEnter(): void{
    this.search.reset();
    this.status$ = this.getStatus(this.selected);
    this.componentStatus = { banlistType: 'tcg', slice: 20, search:null, reload: null};
    this.trigger.next(this.componentStatus);
  }

  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.componentStatus = {...this.componentStatus, search:this.search.value, slice: 20, reload: null};
    this.trigger.next(this.componentStatus);
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.componentStatus = {...this.componentStatus, search:null, slice: 20, reload: null};
    this.trigger.next(this.componentStatus);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.componentStatus = {...this.componentStatus, search:null, slice: 20, reload: this.componentStatus.banlistType};
      this.trigger.next(this.componentStatus);
      event.target.complete();
    }, 500);
  }

  segmentChanged(event): void{
    const { detail:{value = ''} } = event || {};
    this.search.reset();
    this.componentStatus = {...this.componentStatus, banlistType: value, search:null, slice: 20, reload: null};
    this.status$ = this.getStatus(value);
    this.trigger.next(this.componentStatus);
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    setTimeout(() => {
      this.componentStatus = {...this.componentStatus, slice: this.componentStatus.slice + 20, reload: null};
      this.trigger.next(this.componentStatus)
      event.target.complete();
    },500)
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

    const { data } = await popover.onDidDismiss();
    if(!data) return;
    this.store.dispatch(StorageActions.saveCard({card:info}))
  }

  getStatus(selected: string): Observable<EntityStatus>{
    return ({
      'ocg': this.store.select(fromBanlist.selectBanlistOCGStatus),
      'tcg': this.store.select(fromBanlist.selectBanlistTCGStatus)
    }?.[selected]
      || this.store.select(fromBanlist.selectBanlistTCGStatus)).pipe(
      shareReplay(1)
    );
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



}
