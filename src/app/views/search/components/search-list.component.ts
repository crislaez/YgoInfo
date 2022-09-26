import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '@ygopro/shared/models';
import { emptyObject, errorImage, getObjectKeys, sliceText, trackById } from '@ygopro/shared/utils/functions';

@Component({
  selector: 'app-search-list',
  template:`
    <div class="width-max displays-around">
      <ng-container *ngFor="let item of items; trackBy: trackById">
          <ion-card class="ion-activatable ripple-parent" (click)="openSingleCardModal.next(item)" ion-long-press [interval]="400" (pressed)="presentPopover($event, item)">
            <img [src]="getImgage(item?.card_images)" loading="lazy" (error)="errorImage($event)">

            <ng-container *ngIf="emptyObject(item?.banlist_info)">
              <div class="banlist-div">
                <div *ngIf="!!item?.banlist_info?.ban_tcg" class="card-result span-bold font-medium">
                  <span [ngClass]="{'forbidden': item?.banlist_info?.ban_tcg === 'Banned', 'limited': item?.banlist_info?.ban_tcg === 'Limited', 'semi-limited': item?.banlist_info?.ban_tcg === 'Semi-Limited'}">{{ 'COMMON.TCG' | translate}}: </span>
                  <ng-container *ngIf="item?.banlist_info?.ban_tcg === 'Banned'"><img [src]="banned"/></ng-container>
                  <ng-container *ngIf="item?.banlist_info?.ban_tcg === 'Limited'"><img [src]="limited"/></ng-container>
                  <ng-container *ngIf="item?.banlist_info?.ban_tcg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                </div>
                <div *ngIf="!!item?.banlist_info?.ban_ocg" class="card-result span-bold font-medium">
                  <span [ngClass]="{'forbidden': item?.banlist_info?.ban_ocg === 'Banned', 'limited': item?.banlist_info?.ban_ocg === 'Limited', 'semi-limited': item?.banlist_info?.ban_ocg === 'Semi-Limited'}">{{ 'COMMON.OCG' | translate}}: </span>
                  <ng-container *ngIf="item?.banlist_info?.ban_ocg === 'Banned'"><img [src]="banned"/></ng-container>
                  <ng-container *ngIf="item?.banlist_info?.ban_ocg === 'Limited'"><img [src]="limited"/></ng-container>
                  <ng-container *ngIf="item?.banlist_info?.ban_ocg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                </div>
              </div>
            </ng-container>

            <ion-ripple-effect></ion-ripple-effect>
          </ion-card>
      </ng-container>
    </div>
  `,
  styleUrls: ['./search-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchListComponent {

  trackById = trackById;
  errorImage = errorImage;
  sliceText = sliceText;
  getObjectKeys = getObjectKeys;
  emptyObject = emptyObject;

  @Input() items:any;
  @Output() openSingleCardModal = new EventEmitter<Card>();
  @Output() presentPopoverTrigger = new EventEmitter<{event, info}>();

  banned = '../../../../assets/Banned.png';
  limited = './../../../assets/images/Limited.png';
  semiLimited = './../../../assets/images/Semi-limited.png';


  constructor() { }


  presentPopover(event, info): void{
    this.presentPopoverTrigger.next({event, info})
  }

  getImgage(card_images: any[]): string{
    return card_images?.[0]?.image_url_small || card_images?.[0]?.image_url;
  }


}
