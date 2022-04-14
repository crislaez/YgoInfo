import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { BanlistActions, fromBanlist } from '@ygopro/shared/banlist';
import { gotToTop, trackById } from '@ygopro/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/utils/models';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { CardModalComponent } from './../../shared-ui/generics/components/card-modal.component';


@Component({
  selector: 'app-banlist',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color-third"></div>

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
                  <app-infinite-scroll
                    [from]="'banlist'"
                    [page]="componentStatus.perPage"
                    [total]="banlist?.total"
                    [items]="banlist?.banlist"
                    [status]="status"
                    [banlistType]="componentStatus?.banlistType"
                    (loadDataTrigger)="loadData($event)"
                    (openSingleCardModal)="openSingleCardModal($event)">
                  </app-infinite-scroll>
                </ng-container>

              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>

¡
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
  infiniteScroll$ = new EventEmitter<{banlistType: string, perPage: number} >();
  showButton: boolean = false;
  selected = '';
  banlistType = [
    { id:1, type: 'tcg' },
    { id:2, type: 'ocg' }
  ];

  componentStatus: {banlistType: string, perPage: number} = {
    banlistType: 'tcg',
    perPage: 20
  };

  status$ = this.store.select(fromBanlist.getStatus);

  banlist$ = this.infiniteScroll$.pipe(
    startWith(this.componentStatus),
    tap(({ banlistType, perPage }) => {
      if(perPage === 20){
        this.store.dispatch(BanlistActions.loadBanlist({banlistType}));
      }
    }),
    switchMap(({perPage}) =>
      this.store.select(fromBanlist.getBanlist).pipe(
        map(banlist => {
          return {
            banlist: banlist?.slice(0, perPage),
            total: banlist?.length
          }
        })
      )
    )
  );


  constructor(
    private store: Store,
    public modalController: ModalController
  ) {
    this.selected = this.banlistType?.[0]?.type
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
      this.componentStatus = {...this.componentStatus, perPage: 20};
      this.infiniteScroll$.next(this.componentStatus)
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }

  segmentChanged(event): void{
    const { detail:{value = ''} } = event || {};
    this.componentStatus = { ...this.componentStatus, banlistType: value, perPage: 20};
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
