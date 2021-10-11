import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { errorImage, gotToTop, trackById, emptyObject } from '@ygopro/shared/shared/utils/utils';
import { IonInfiniteScroll } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { CardActions, fromCard } from '@ygopro/shared/card';

@Component({
  selector: 'app-card',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <ng-container *ngIf="(card$ | async) as card">
      <ng-container *ngIf="(status$ | async) as status">
        <ng-container *ngIf="status !== 'pending'; else loader">
          <ng-container *ngIf="status !== 'error'; else serverError">
            <ng-container *ngIf="emptyObject(card); else noData">

              <div class="container components-color-second" [ngClass]="cardType(card?.type)">

                <div class="header" no-border>
                  <ion-back-button defaultHref="/moster" class="text-second-color" [text]="''"></ion-back-button>
                  <h1 class="text-second-color">{{ card?.name }}</h1>
                  <div class="header-container-empty"></div>
                </div>

                <ion-card class="ifade-in-card card-card">
                  <img [src]="card?.card_images[0]?.image_url" loading="lazy" (error)="errorImage($event)">
                </ion-card>

                <ion-card class="fade-in-card card-card">
                  <ion-card-content>
                    <ng-container *ngIf="!!card?.level">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.LEVEL' | translate}}</span> </div>
                      <div class="card-result font-medium">  <span>{{ card?.level }}</span> </div>
                    </ng-container>

                    <br>
                    <ng-container *ngIf="!!card?.type">
                      <div class="card-type span-bold mediun-size">  <span>{{ 'COMMON.TYPE' | translate}}</span> </div>
                      <div class="card-result font-medium">  <span>{{ card?.type }}</span> </div>
                    </ng-container>

                    <br>
                    <ng-container *ngIf="!!card?.attribute">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.ATTRIBUTE' | translate}}</span> </div>
                      <div class="card-result font-medium">  <span>{{ card?.attribute }}</span> </div>
                    </ng-container>

                    <br>
                    <ng-container *ngIf="!!card?.race">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.RACE' | translate}}</span> </div>
                      <div class="card-result font-medium">  <span>{{ card?.race }}</span> </div>
                    </ng-container>

                    <br>
                    <ng-container *ngIf="!!card?.atk">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.ATTACK' | translate}}</span> </div>
                      <div class="card-result font-medium">  <span>{{ card?.atk }}</span> </div>
                    </ng-container>

                    <br>
                    <ng-container *ngIf="!!card?.def">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.DEFENDING' | translate}}</span> </div>
                      <div class="card-result font-medium">  <span>{{ card?.def }}</span> </div>
                    </ng-container>

                    <br>
                    <ng-container *ngIf="!!card?.desc">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.DESCRIPTION' | translate}}</span> </div>
                      <div class="card-result font-medium">  <span>{{ card?.desc }}</span> </div>
                    </ng-container>
                    <br>

                    <ng-container *ngIf="card?.card_sets?.length > 0">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.EXPANSION' | translate}}</span> </div>
                      <div class="card-result font-medium">
                        <ng-container *ngFor="let cardSet of card?.card_sets">
                          <span><span class="span-bold">{{ 'COMMON.EXPANSION_NAME' | translate}}: </span> <span>{{ cardSet?.set_name }}</span></span>
                          <br>
                          <span><span class="span-bold">{{ 'COMMON.EXPANSION_CODE' | translate}}: </span> <span>{{ cardSet?.set_code }}</span></span>
                          <br>
                          <span><span class="span-bold">{{ 'COMMON.RARITY' | translate}}: </span> <span>{{ cardSet?.set_rarity }}</span></span>
                          <br>
                          <span><span class="span-bold">{{ 'COMMON.PRICE' | translate}}: </span> <span>{{ cardSet?.set_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                          <br>
                          <br>
                        </ng-container>
                      </div>
                    </ng-container>
                    <br>

                    <ng-container *ngIf="card?.card_prices?.length > 0">
                      <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.PRICES' | translate}}</span> </div>
                      <div class="card-result font-medium">
                        <ng-container *ngFor="let prices of card?.card_prices">
                          <span><span class="span-bold">{{ 'COMMON.CARD_MARKER' | translate}}: </span> <span>{{ prices?.cardmarket_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                          <br>
                          <span><span class="span-bold">{{ 'COMMON.TCG_PLAYER' | translate}}: </span> <span>{{ prices?.tcgplayer_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                          <br>
                          <span><span class="span-bold">{{ 'COMMON.EBAY' | translate}}: </span> <span>{{ prices?.ebay_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                          <br>
                          <span><span class="span-bold">{{ 'COMMON.AMAZON' | translate}}: </span> <span>{{ prices?.amazon_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                          <br>
                          <span><span class="span-bold">{{ 'COMMON.COOL_STUFFINC' | translate}}: </span> <span>{{ prices?.coolstuffinc_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                          <br>
                          <br>
                        </ng-container>
                      </div>
                    </ng-container>
                    <br>

                  </ion-card-content>
                </ion-card>
              </div>

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
        <div class="header" no-border>
          <ion-back-button defaultHref="/moster" class="text-second-color" [text]="''"></ion-back-button>
          <!-- <h1 class="text-second-color">{{ card?.name }}</h1> -->
          <div class="header-container-empty"></div>
        </div>
        <div>
          <span><ion-icon class="text-second-color big-size" name="cloud-offline-outline"></ion-icon></span>
          <br>
          <span class="text-second-color">{{'COMMON.ERROR' | translate}}</span>
        </div>
      </div>
    </ng-template>

    <!-- IS NO DATA  -->
    <ng-template #noData>
      <div class="header" no-border>
        <ion-back-button defaultHref="/moster" class="text-second-color" [text]="''"></ion-back-button>
        <!-- <h1 class="text-second-color">{{ card?.name }}</h1> -->
        <div class="header-container-empty"></div>
      </div>
      <div class="error-serve">
        <span class="text-second-color">{{'COMMON.NORESULT' | translate}}</span>
      </div>
    </ng-template>

    <!-- LOADER  -->
    <ng-template #loader>
      <ion-spinner class="loadingspinner"></ion-spinner>
    </ng-template>

    </ng-container>
    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content>
  `,
  styleUrls: ['./card.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardPage {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;

  showButton: boolean = false;

  status$ = this.store.select(fromCard.getStatus);

  card$ = this.route.params.pipe(
    tap(({id}) => {
      this.store.dispatch(CardActions.loadCard({id}))
    }),
    switchMap(() =>
      this.store.select(fromCard.getCard)
    )
  );


  constructor (
    private store: Store,
    private route: ActivatedRoute
  ) { }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

    // REFRESH
    doRefresh(event) {
      setTimeout(() => {
        let { id } = this.route.snapshot.params || {}
        // console.log(id)
        this.store.dispatch(CardActions.loadCard({id}))

        event.target.complete();
      }, 500);
    }

  cardType(type: string): string{
    if(type === 'Spell Card') return 'magic';
    if(type === 'Trap Card') return 'trap'
    else return 'monster';
  }

}
