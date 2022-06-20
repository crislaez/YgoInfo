import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { errorImage, sliceText, trackById } from '@ygopro/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/utils/models';

@Component({
  selector: 'app-banlist-list',
  template:`
  <ion-list class="banlist-list-wrapper">
    <ion-item detail *ngFor="let card of items; trackBy: trackById" (click)="openSingleCardModal.next(card)">
      <ion-img [src]="getImgage(card?.card_images)" loading="lazy" (ionError)="errorImage($event)"></ion-img>

      <ion-label class="font-medium text-second-color label-name" >{{ sliceText(card?.name, 20) }}</ion-label>

      <ng-container *ngIf="banlistType === 'tcg'; else ocgTemplate">
        <ion-label class="label-banlist" [ngClass]="{'forbidden':card?.banlist_info?.ban_tcg === 'Banned',  'limited':card?.banlist_info?.ban_tcg === 'Limited',  'semi-limited':card?.banlist_info?.ban_tcg === 'Semi-Limited'}" >
          {{ card?.banlist_info?.ban_tcg }}
        </ion-label>
      </ng-container>

      <ng-template #ocgTemplate>
        <ion-label class="label-banlist" [ngClass]="{'forbidden':card?.banlist_info?.ban_ocg === 'Banned',  'limited':card?.banlist_info?.ban_ocg === 'Limited',  'semi-limited':card?.banlist_info?.ban_ocg === 'Semi-Limited'}" >
          {{ card?.banlist_info?.ban_ocg }}
        </ion-label>
      </ng-template>
    </ion-item>
  </ion-list>
  `,
  styleUrls: ['./banlist-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BanlistListComponent {

  trackById = trackById;
  errorImage = errorImage;
  sliceText = sliceText;

  @Input() banlistType: string;
  @Input() items:any;
  @Output() openSingleCardModal = new EventEmitter<Card>();

  banned = '../../../../assets/Banned.png';
  limited = './../../../assets/images/Limited.png';
  semiLimited = './../../../assets/images/Semi-limited.png';


  constructor() { }


  getImgage(card_images: any[]): string{
    return card_images?.[0]?.image_url_small || card_images?.[0]?.image_url;
  }

}
