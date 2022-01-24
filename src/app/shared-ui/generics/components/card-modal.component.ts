import { Card } from '@ygopro/shared/utils/models/index';
import { ModalController } from '@ionic/angular';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { emptyObject, sliceTest, errorImage, gotToTop, trackById } from '@ygopro/shared/utils/helpers/functions';


@Component({
  selector: 'app-card-modal',
  template:`
  <!-- HEADER  -->
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-title class="text-color">{{ sliceTest(this.card?.name) }}</ion-title>
      <ion-buttons class="text-color" slot="end">
        <ion-button class="ion-button-close" (click)="dismiss()"><ion-icon fill="clear" class="text-color" name="close-outline"></ion-icon></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true" [scrollEvents]="true" >

    <ng-container *ngIf="emptyObject(card); else noData">

      <div class="container components-color-second" [ngClass]="cardType(card?.type)">

      <div class="empty-header-mid"></div>

        <ion-card *ngFor="let image of card?.card_images" class="ifade-in-card card-card">
          <img [src]="image?.image_url" loading="lazy" (error)="errorImage($event)">
        </ion-card>

        <ion-card class="fade-in-card card-card">
          <ion-card-content>

            <ng-container *ngIf="emptyObject(card?.banlist_info)">
              <div class="card-type span-bold mediun-size">  <span>{{ 'COMMON.BANLIST' | translate}}</span> </div>
              <div *ngIf="!!card?.banlist_info?.ban_tcg" class="card-result span-bold font-medium"> <span>{{ 'COMMON.TCG' | translate}}: </span>
                <span [ngClass]="{'forbidden': card?.banlist_info?.ban_tcg === 'Banned', 'limited': card?.banlist_info?.ban_tcg === 'Limited', 'semi-limited': card?.banlist_info?.ban_tcg === 'Semi-Limited'}">{{ card?.banlist_info?.ban_tcg }}</span>
              </div>
              <div *ngIf="!!card?.banlist_info?.ban_ocg" class="card-result span-bold font-medium"> <span>{{ 'COMMON.OCG' | translate}}: </span>
                <span [ngClass]="{'forbidden': card?.banlist_info?.ban_ocg === 'Banned', 'limited': card?.banlist_info?.ban_ocg === 'Limited', 'semi-limited': card?.banlist_info?.ban_ocg === 'Semi-Limited'}">{{ card?.banlist_info?.ban_ocg }}</span>
              </div>
              <br>
            </ng-container>

            <ng-container *ngIf="!!card?.level">
              <div class="card-type span-bold mediun-size">
                <span *ngIf="card?.type !== 'XYZ Monster'; else rank">{{ 'COMMON.LEVEL' | translate}}</span>
                <ng-template #rank> <span>{{ 'COMMON.RANK' | translate}}</span> </ng-template>
              </div>
              <div class="card-result font-medium">  <span>{{ card?.level }}</span> </div>
              <br>
            </ng-container>

            <ng-container *ngIf="!!card?.scale">
              <div class="card-type span-bold mediun-size">  <span>{{ 'COMMON.SCALE' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.scale }}</span> </div>
              <br>
            </ng-container>

            <ng-container *ngIf="!!card?.linkval">
              <div class="card-type span-bold mediun-size">  <span>{{ 'COMMON.LINK' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.linkval }}</span> </div>
              <br>
            </ng-container>

            <ng-container *ngIf="!!card?.type">
              <div class="card-type span-bold mediun-size">  <span>{{ 'COMMON.TYPE' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.type }}</span> </div>
              <br>
            </ng-container>

            <ng-container *ngIf="!!card?.attribute">
              <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.ATTRIBUTE' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.attribute }}</span> </div>
              <br>
            </ng-container>

            <ng-container *ngIf="!!card?.race">
              <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.RACE' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.race }}</span> </div>
              <br>
            </ng-container>


            <ng-container *ngIf="!!card?.atk">
              <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.ATTACK' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.atk }}</span> </div>
              <br>
            </ng-container>


            <ng-container *ngIf="!!card?.def">
              <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.DEFENDING' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.def }}</span> </div>
              <br>
            </ng-container>


            <ng-container *ngIf="!!card?.desc">
              <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.DESCRIPTION' | translate}}</span> </div>
              <div class="card-result font-medium">  <span>{{ card?.desc }}</span> </div>
              <br>
            </ng-container>

            <ng-container *ngIf="card?.card_sets?.length > 0">
              <div class="card-type span-bold mediun-size"> <span>{{ 'COMMON.EXPANSION' | translate}}</span> </div>
              <div class="card-result font-medium">
                <ng-container *ngFor="let cardSet of card?.card_sets">
                  <span><span class="span-bold">{{ 'COMMON.EXPANSION_NAME' | translate}}: </span> <span>{{ cardSet?.set_name }}</span></span>
                  <br>
                  <span><span class="span-bold">{{ 'COMMON.EXPANSION_CODE' | translate}}: </span> <span>{{ cardSet?.set_code }}</span></span>
                  <br>
                  <span><span class="span-bold">{{ 'COMMON.RARITY' | translate}}: </span> <span>{{ cardSet?.set_rarity }} {{ cardSet?.set_rarity_code }}</span></span>
                  <br>
                  <span><span class="span-bold">{{ 'COMMON.PRICE' | translate}}: </span> <span class="text-color-four">{{ cardSet?.set_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
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
                  <span><span class="span-bold">{{ 'COMMON.CARD_MARKER' | translate}}: </span> <span class="text-color-four">{{ prices?.cardmarket_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                  <br>
                  <span><span class="span-bold">{{ 'COMMON.TCG_PLAYER' | translate}}: </span> <span class="text-color-four">{{ prices?.tcgplayer_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                  <br>
                  <span><span class="span-bold">{{ 'COMMON.EBAY' | translate}}: </span> <span class="text-color-four">{{ prices?.ebay_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                  <br>
                  <span><span class="span-bold">{{ 'COMMON.AMAZON' | translate}}: </span> <span class="text-color-four">{{ prices?.amazon_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
                  <br>
                  <span><span class="span-bold">{{ 'COMMON.COOL_STUFFINC' | translate}}: </span> <span class="text-color-four">{{ prices?.coolstuffinc_price | currency:'USD':'symbol':'1.2-2' }}</span></span>
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


    <!-- TO TOP BUTTON  -->
    <!-- <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab> -->
  </ion-content>
  `,
  styleUrls: ['./card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardModalComponent {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  sliceTest = sliceTest;
  @Input() card: Card;


  constructor(
    private modalController: ModalController,
  ) { }


  cardType(type: string): string{
    if(type === 'Spell Card') return 'magic';
    if(type === 'Trap Card') return 'trap'
    else return 'monster';
  }

  // CLOSE MODAL
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
