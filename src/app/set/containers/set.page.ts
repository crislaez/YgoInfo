import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, ModalController, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CardModalComponent } from '@ygopro/shared-ui/generics/components/card-modal.component';
import { PopoverComponent } from '@ygopro/shared-ui/generics/components/poper.component';
import { CardActions, Filter, fromCard } from '@ygopro/shared/card';
import { emptyObject, errorImage, gotToTop, trackById } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';
import { StorageActions } from '@ygopro/shared/storage';
import { switchMap, tap, map } from 'rxjs/operators';
import { ModalFilterComponent } from '@ygopro/shared-ui/generics/components/modal-filter.component';
import { fromFilter } from '@ygopro/shared/filter';
import { combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-set',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-color-third"></div>

    <div class="container components-color-second">



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
  styleUrls: ['./set.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetPage {

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
    this.store.select(fromFilter.getTypes)
  ]).pipe(
    map(([cardFormat, cardType]) => ({cardFormat, cardType})),
  );

  infiniteScroll$ = new EventEmitter<{page:number, filter: Filter}>();
  statusComponent: {page: number, filter: Filter} = {
    page: 0,
    filter: {
      cardset: this.route.snapshot.params?.setName || ''
    }
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
    public modalController: ModalController,
    private route: ActivatedRoute,
  ) { }


  ionViewWillEnter(): void{
    this.search.reset();
    this.statusComponent = { page:0, filter:{ cardset: this.route.snapshot.params?.setName || ''  } };
    console.log(this.statusComponent)
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
      console.log(this.statusComponent?.page , this.perPageSum)
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
    const { cardFormat = null, cardType = null } = filters || {};

    const modal = await this.modalController.create({
      component: ModalFilterComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        statusComponent: this.statusComponent,
        cardType,
        cardFormat
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


}
