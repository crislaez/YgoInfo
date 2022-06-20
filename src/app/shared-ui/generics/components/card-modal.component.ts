import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { emptyObject, errorImage, gotToTop, sliceText, trackById } from '@ygopro/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/utils/models/index';


@Component({
  selector: 'app-card-modal',
  template:`
  <ion-header class="ion-no-border">
    <ion-toolbar >
      <ion-title class="text-color">{{ sliceText(this.card?.name, 25) }}</ion-title>
      <ion-buttons class="text-color" slot="end">
        <ion-button class="ion-button-close" (click)="dismiss()"><ion-icon fill="clear" class="text-color" name="close-outline"></ion-icon></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true" [scrollEvents]="true" >

    <ng-container *ngIf="emptyObject(card); else noData">

      <div class="container components-color-second" [ngClass]="cardType(card?.type)">

      <div class="empty-header-mid"></div>

        <ion-card *ngFor="let image of card?.card_images" class="fade-in-card card-card">
          <img class="principal-image" [src]="image?.image_url" loading="lazy" (error)="errorImage($event)">
        </ion-card>

        <ion-card class="fade-in-card card-card">
          <ion-card-content>

            <ng-container *ngIf="emptyObject(card?.banlist_info)">
              <div class="card-type span-bold mediun-size">  <span>{{ 'COMMON.BANLIST' | translate}}</span> </div>
              <div *ngIf="!!card?.banlist_info?.ban_tcg" class="margin-top-10 card-result span-bold font-medium">
                <span class="banlist-chip">{{ 'COMMON.TCG' | translate}}: </span>
                <span class="banlist-chip" [ngClass]="{'forbidden': card?.banlist_info?.ban_tcg === 'Banned', 'limited': card?.banlist_info?.ban_tcg === 'Limited', 'semi-limited': card?.banlist_info?.ban_tcg === 'Semi-Limited'}">{{ card?.banlist_info?.ban_tcg }}</span>
              </div>
              <div *ngIf="!!card?.banlist_info?.ban_ocg" class="margin-top-10 card-result span-bold font-medium">
                <span class="banlist-chip">{{ 'COMMON.OCG' | translate}}: </span>
                <span class="banlist-chip" [ngClass]="{'forbidden': card?.banlist_info?.ban_ocg === 'Banned', 'limited': card?.banlist_info?.ban_ocg === 'Limited', 'semi-limited': card?.banlist_info?.ban_ocg === 'Semi-Limited'}">{{ card?.banlist_info?.ban_ocg }}</span>
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

            <ng-container *ngFor="let item of iterates; let i = index; trackBy: trackById">
              <ng-container *ngIf="!!card?.[item?.field]">
                <div class="card-type span-bold mediun-size"> <span>{{ item?.label | translate}}</span> </div>
                <div class="card-result font-medium">  <span>{{ card?.[item?.field] }}</span> </div>
                <br>
              </ng-container>
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
      <app-spinner [top]="'80%'"></app-spinner>
    </ng-template>

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
  sliceText = sliceText;
  @Input() card: Card;

  iterates = [
    {id:1, field:'scale', label:'COMMON.SCALE'},
    {id:2, field:'linkval', label:'COMMON.LINK'},
    {id:3, field:'type', label:'COMMON.TYPE'},
    {id:4, field:'attribute', label:'COMMON.ATTRIBUTE'},
    {id:5, field:'race', label:'COMMON.RACE'},
    {id:6, field:'atk', label:'COMMON.ATTACK'},
    {id:7, field:'def', label:'COMMON.DEFENDING'},
    {id:8, field:'desc', label:'COMMON.DESCRIPTION'}
  ]

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
