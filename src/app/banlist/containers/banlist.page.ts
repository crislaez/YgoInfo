import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { BanlistActions, fromBanlist } from '@ygopro/shared/banlist';
import { errorImage, gotToTop, sliceTest, trackById } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';
import { map, startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-banlist',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="container components-color-second">

        <div class="header" no-border>
          <div class="header-container-empty" ></div>
          <h1 class="text-second-color">{{'COMMON.BANLIST' | translate}}</h1>
          <div class="header-container-empty"></div>
        </div>

        <!-- Disabled Segment -->
        <ion-segment (ionChange)="segmentChanged($event)" [value]="banlistType[0]?.type">
          <ion-segment-button [value]="ban?.type" *ngFor="let ban of banlistType; trackBy: trackById">
            <ion-label>{{ ban?.type }}</ion-label>
          </ion-segment-button>
        </ion-segment>

        <ng-container *ngIf="(banlist$ | async) as banlist">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending'; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">

                <ng-container *ngIf="banlist?.banlist?.length > 0; else noData">
                  <ion-list>
                    <ion-item lines="full" *ngFor="let card of banlist?.banlist; trackBy: trackById" (click)="redirect(card)">
                      <div>
                        <ion-label class="font-medium text-second-color label-name" >{{ sliceTest(card?.name) }}</ion-label>
                        <ion-label fixed class="label-image" ><img [src]="card?.card_images[0]?.image_url" loading="lazy" (error)="errorImage($event)"></ion-label>
                        <ng-container *ngIf="componentStatus?.banlistType === 'tcg'; else ocgTemplate">
                          <ion-label class="label-banlist" [ngClass]="{'forbidden':card?.banlist_info?.ban_tcg === 'Banned',  'limited':card?.banlist_info?.ban_tcg === 'Limited',  'semi-limited':card?.banlist_info?.ban_tcg === 'Semi-Limited'}" >{{ card?.banlist_info?.ban_tcg }}</ion-label>
                        </ng-container>
                        <ng-template #ocgTemplate>
                          <ion-label class="label-banlist" [ngClass]="{'forbidden':card?.banlist_info?.ban_ocg === 'Banned',  'limited':card?.banlist_info?.ban_ocg === 'Limited',  'semi-limited':card?.banlist_info?.ban_ocg === 'Semi-Limited'}" >{{ card?.banlist_info?.ban_ocg }}</ion-label>
                        </ng-template>
                      </div>
                    </ion-item>
                  </ion-list>

                 <!-- INFINITE SCROLL  -->
                  <ng-container *ngIf="componentStatus.perPage <= banlist?.total">
                    <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, banlist?.total)">
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
          <div class="error-serve">
            <div>
              <span span><ion-icon class="text-second-color max-size" name="clipboard-outline"></ion-icon></span>
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
  styleUrls: ['./banlist.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BanlistPage {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  sliceTest = sliceTest;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent
  infiniteScroll$ = new EventEmitter<{banlistType: string, perPage: number} >();
  showButton: boolean = false;
  banlistType: {id:number, type: string}[] = [
    {
      id:1,
      type: 'tcg'
    },
    {
      id:1,
      type: 'ocg'
    }
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
    private router: Router
  ) { }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // INIFINITE SCROLL
  loadData(event, total) {
    setTimeout(() => {
      // this.statusComponent = {...this.statusComponent, offset:(this.statusComponent?.offset + 21) };
      this.componentStatus = {...this.componentStatus, perPage: this.componentStatus.perPage + 20};

      if(this.componentStatus?.perPage >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }

      this.infiniteScroll$.next(this.componentStatus)
      event.target.complete();
    }, 500);
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

  redirect(card: Card): void{
    this.router.navigate(['/card/' + card?.id])
  }

}
