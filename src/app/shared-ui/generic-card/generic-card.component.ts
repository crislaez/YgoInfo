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
          <span *ngIf="item?.name as name" class="span-bold">{{ sliceText(name,30) }}</span>
          <span *ngIf="item?.set_name as name" class="span-bold">{{ sliceText(name,30) }}</span>
        </div>
      </div>

      <div class="item-item-types displays-around">
        <ion-chip *ngIf="item?.tcg_date" class="width-90 text-color">
          <ion-label class="text-color font-medium">{{ item?.tcg_date }}</ion-label>
        </ion-chip>
        <ion-chip *ngIf="item?.num_of_cards" class="width-90 text-color">
          <ion-label class="text-color font-medium">{{ 'COMMON.TOTAL_CARDS' | translate }} {{ item?.num_of_cards }}</ion-label>
        </ion-chip>
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
