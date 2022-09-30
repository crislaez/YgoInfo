import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { errorImage, sliceText } from '@ygopro/shared/utils/functions';


@Component({
  selector: 'ygopro-generic-card',
  template:`
  <ion-card
    class="ion-activatable ripple-parent item-card"
    [ngStyle]="{'background':backgroundColor}"
    (click)="onClick()">

    <div class="item-item displays-around" >
      <div class="item-item-title displays-center" >
        <div class="span-text text-color padding-5 div-title">
          <span *ngIf="item?.name as name" class="span-bold text-center">{{ sliceText(name, 28) }}</span>
          <span *ngIf="item?.set_name as name" class="span-bold text-center">{{ sliceText(name, 28) }}</span>
        </div>
      </div>

      <div class="item-item-types displays-around">
        <ion-chip *ngIf="item?.tcg_date as tcg_date" class="width-90 text-color">
          <ion-label class="text-color font-medium">{{ tcg_date }}</ion-label>
        </ion-chip>
        <ion-chip *ngIf="item?.num_of_cards as num_of_cards" class="width-90 text-color">
          <ion-label class="text-color font-medium">{{ num_of_cards }} {{ 'COMMON.CARDS' | translate }} </ion-label>
        </ion-chip>

        <ion-chip *ngIf="item?.set_rarity || item?.set_price" class="width-90 text-color">
          <ion-label class="text-color font-medium">
            <ng-container *ngIf="item?.set_rarity as set_rarity">{{ set_rarity }} : </ng-container>
            <ng-container *ngIf="item?.set_price as set_price"> {{ set_price }} $</ng-container>
          </ion-label>
        </ion-chip>

        <!-- <ion-chip *ngIf="item?.set_code as set_code" class="width-90 text-color">
          <ion-label class="text-color font-medium">{{ 'COMMON.CODE' | translate }}: {{ set_code }}  </ion-label>
        </ion-chip> -->
        <!-- <ion-chip *ngIf="item?.set_price as set_price" class="width-90 text-color">
          <ion-label class="text-color font-medium">{{ 'COMMON.PRICE' | translate }} {{ set_price }} </ion-label>
        </ion-chip> -->
      </div>
    </div>

    <!-- RIPLE EFFECT  -->
    <ion-ripple-effect></ion-ripple-effect>
  </ion-card>
  `,
  styleUrls: ['./generic-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericCardComponent {

  sliceText = sliceText;
  errorImage = errorImage;

  @Input() item: any;
  @Input() from: string;
  @Input() backgroundColor: string;
  @Output() openSingleCardModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();


  constructor(
    private router: Router
  ) { }


  onClick(): void {
    this.close.next();
    this.router.navigate([`/${this.from}/${this.item?.set_name}`])
  }


}

// CARD_MARKER
// TCG_PLAYER
// EBAY
// AMAZON
// COOL_STUFFINC
