import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Card } from '@ygopro/shared/models/index';
import { appColors, BANNED, cardColor, errorImage, getLastNumber, gotToTop, isNotEmptyObject, LIMIT, SEMI_LIMIT, sliceText, trackById } from '@ygopro/shared/utils/functions';

@Component({
  selector: 'app-card-modal',
  template:`
  <ion-header class="ion-no-border"
    [ngStyle]="{'background':cardColor(card)}">
    <ion-toolbar >
      <ion-title class="text-color">{{ card?.name }}</ion-title>
      <ion-buttons class="text-color" slot="end">
        <ion-button class="ion-button-close" (click)="dismiss()"><ion-icon fill="clear" class="text-color" name="close-outline"></ion-icon></ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true" [scrollEvents]="true" >
    <ng-container *ngIf="isNotEmptyObject(card); else noData">
      <div class="empty-header-mid"
        [ngStyle]="{'background':cardColor(card)}">
      </div>

      <div class="container components-color-second container-top-radius">
        <ion-card class="fade-in-card banner-card card-card">
          <ion-img
            *ngFor="let image of card?.card_images; trackBy: trackById"
            loading="lazy"
            [src]="image?.image_url"
            [alt]="image?.image_url"
            (ionError)="errorImage($event)">
          </ion-img>
        </ion-card>

        <!-- INFO  -->
        <div class="div-center">
          <h2 class="text-color">{{ 'COMMON.INFO' | translate}}</h2>
        </div>

        <ion-card class="fade-in-card card-card">
          <ion-card-content class="displays-between">
            <!-- BANLIST  -->
            <ng-container *ngIf="isNotEmptyObject(card?.banlist_info)">
              <ng-container *ngIf="!!card?.banlist_info?.ban_tcg" class="margin-top-10 span-bold">
                <div class="width-40 height-30 text-color span-bold "> {{ 'COMMON.BANLIST' | translate }} {{ 'COMMON.TCG' | translate}}: </div>
                <div class="width-40 height-30 text-color">
                  <img *ngIf="card?.banlist_info?.ban_tcg as banlist"
                    [src]="(banlist === 'Banned'
                        ? BANNED
                        : banlist === 'Limited'
                        ? LIMIT
                        : banlist === 'Semi-Limited'
                        ? SEMI_LIMIT
                        : SEMI_LIMIT)"
                    />
                </div>
              </ng-container>

              <ng-container *ngIf="!!card?.banlist_info?.ban_ocg" class="margin-top-10  span-bold">
                <div class="width-40 height-30 text-color span-bold "> {{ 'COMMON.BANLIST' | translate }} {{ 'COMMON.OCG' | translate}}: </div>
                <div class="width-40 height-30 text-color">
                  <img *ngIf="card?.banlist_info?.ban_ocg as banlist"
                    [src]="(banlist === 'Banned'
                        ? BANNED
                        : banlist === 'Limited'
                        ? LIMIT
                        : banlist === 'Semi-Limited'
                        ? SEMI_LIMIT
                        : SEMI_LIMIT)"
                    />
                </div>
              </ng-container>
            </ng-container>

            <!-- LEVEL / RANK / LINK  -->
            <ng-container *ngIf="!!card?.level">
              <div *ngIf="card?.type !== 'XYZ Monster'; else rank" class="width-40 height-30 text-color span-bold">{{ 'COMMON.LEVEL' | translate}}:</div>
              <ng-template #rank> <div class="width-40 height-30 text-color span-bold ">{{ 'COMMON.RANK' | translate}}: </div> </ng-template>
              <div class="width-40 height-30 text-color">{{ card?.level }}</div>
            </ng-container>

            <ng-container *ngFor="let info of infoIteratable; let i = index; trackBy: trackById">
              <ng-container *ngIf="!!card?.[info?.field]">
                <div class="width-40 height-30 text-color span-bold">{{ info?.label | translate }}:</div>
                <div class="width-40 height-30 text-color"
                  [ngStyle]="{'width':info?.field === 'desc' ? '90%': '40%', 'margin-bottom': info?.field === 'desc' ? '20px': '0px' }">{{ card?.[info?.field] }} </div>
              </ng-container>
            </ng-container>
          </ion-card-content>
        </ion-card>

        <!-- SETS  -->
        <ng-container *ngIf="card?.card_sets?.length > 0">
          <div class="div-center">
            <h2 class="text-color">{{ 'COMMON.EXPANSION' | translate}}</h2>
          </div>
          <ion-card class="fade-in-card card-card">
            <ion-card-content class="displays-between width-max">
              <ygopro-generic-card
                *ngFor="let set of card?.card_sets; let i = index; trackBy: trackById"
                [item]="set"
                [backgroundColor]="appColors?.[getLastNumber(i)]"
                [from]="'set'"
                (close)="dismiss()">
              </ygopro-generic-card>
            </ion-card-content>
          </ion-card>
        </ng-container>


        <!-- PRICES  -->
        <ng-container *ngIf="card?.card_prices?.length > 0">
          <div class="div-center">
            <h2 class="text-color">{{ 'COMMON.PRICES' | translate}}</h2>
          </div>
          <ion-card class="fade-in-card card-card">
            <ion-card-content class="displays-between">
              <ng-container *ngFor="let prices of card?.card_prices; trackBy: trackById">
                <ng-container *ngFor="let priceItem of priceIteratable; trackBy: trackById">
                  <ng-container *ngIf="prices?.[priceItem?.key] as price">
                    <div class="width-40 height-30 text-color span-bold">{{ priceItem?.label | translate}}: </div>
                    <div class="width-40 height-30 text-color-four">{{ price | currency:'USD':'symbol':'1.2-2' }}</div>
                  </ng-container>
                </ng-container>
              </ng-container>
            </ion-card-content>
          </ion-card>
        </ng-container>
      </div>
    </ng-container>

    <!-- IS NO DATA  -->
    <ng-template #noData>
      <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'30vh'"></app-no-data>
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

  LIMIT = LIMIT;
  BANNED = BANNED;
  SEMI_LIMIT = SEMI_LIMIT;
  gotToTop = gotToTop;
  cardColor = cardColor;
  appColors = appColors;
  trackById = trackById;
  sliceText = sliceText;
  errorImage = errorImage;
  getLastNumber = getLastNumber;
  isNotEmptyObject = isNotEmptyObject;
  @Input() card: Card;

  infoIteratable = [
    {id:1, field:'scale', label:'COMMON.SCALE'},
    {id:2, field:'linkval', label:'COMMON.LINK'},
    {id:3, field:'type', label:'COMMON.TYPE'},
    {id:4, field:'attribute', label:'COMMON.ATTRIBUTE'},
    {id:5, field:'race', label:'COMMON.RACE'},
    {id:6, field:'atk', label:'COMMON.ATTACK'},
    {id:7, field:'def', label:'COMMON.DEFENDING'},
    {id:8, field:'desc', label:'COMMON.DESCRIPTION'}
  ];

  priceIteratable = [
    {id:1, label:'COMMON.CARD_MARKER', key:'cardmarket_price'},
    {id:2, label:'COMMON.TCG_PLAYER', key:'tcgplayer_price'},
    {id:3, label:'COMMON.EBAY', key:'ebay_price'},
    {id:4, label:'COMMON.AMAZON', key:'amazon_price'},
    {id:5, label:'COMMON.COOL_STUFFINC', key:'coolstuffinc_price'},
  ];

  constructor(
    private modalController: ModalController,
  ) { }


  // CLOSE MODAL
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
