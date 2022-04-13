import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityStatus, errorImage, getObjectKeys, sliceTest, sliceTestMid, trackById } from '@ygopro/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/utils/models';


@Component({
  selector: 'app-infinite-scroll',
  template:`
    <ng-container *ngIf="from === 'home'">
      <ion-list class="sets-list-wrapper margin-top">
        <ion-item detail *ngFor="let item of items; let i = index; trackBy: trackById" [routerLink]="['/set/'+item?.set_name]" [queryParams]="{name:item?.name}">
          <div class="width-90 displays-center">
            <div *ngIf="item?.set_name" >{{ sliceTest(item?.set_name) }}</div>
            <div *ngIf="item?.tcg_date" >{{ item?.tcg_date }}</div>
          </div>
        </ion-item>
      </ion-list>
    </ng-container>

    <ng-container *ngIf="from === 'set'">
      <ion-list class="set-card-wrapper">
        <ion-item detail *ngFor="let item of items; let i = index; trackBy: trackById" (click)="openSingleCardModal.next(item)" ion-long-press [interval]="400" (pressed)="presentPopover($event, item)">
          <ion-img [src]="getImgage(item?.card_images)" loading="lazy" (ionError)="errorImage($event)"></ion-img>
          <ion-label *ngIf="item?.name" >{{ sliceTest(item?.name) }}</ion-label>
        </ion-item>
      </ion-list>
    </ng-container>

    <ng-container *ngIf="from === 'search'">
      <ion-list class="banlist-list-wrapper">
        <ion-item detail lines="full" *ngFor="let card of items; trackBy: trackById" (click)="openSingleCardModal.next(card)">
          <ion-img [src]="getImgage(card?.card_images)" loading="lazy" (ionError)="errorImage($event)"></ion-img>

          <ion-label class="font-medium text-second-color label-name" >{{ sliceTestMid(card?.name) }}</ion-label>

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
    </ng-container>

    <!-- INFINITE SCROLL  -->
    <ng-container *ngIf="getPage < total">
      <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
        <ion-infinite-scroll-content >
          <app-spinner [top]="'0%'" *ngIf="$any(status) === 'pending'"></app-spinner>
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ng-container>
  `,
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollComponent {

  trackById = trackById;
  errorImage = errorImage;
  sliceTest = sliceTest;
  getObjectKeys = getObjectKeys;
  sliceTestMid = sliceTestMid;
  @Input() from:string;
  @Input() page:number
  @Input() total:number
  @Input() items:any;
  @Input() status: EntityStatus;
  @Input() banlistType: string;
  @Output() loadDataTrigger = new EventEmitter<{event, total}>();
  @Output() openSingleCardModal = new EventEmitter<Card>();
  @Output() presentPopoverTrigger = new EventEmitter<{event, info}>();


  constructor() { }


  getImgage(card_images: any[]): string{
    return card_images?.[0]?.image_url_small || card_images?.[0]?.image_url;
  }

  loadData(event, total): void{
    this.loadDataTrigger.next({event, total})
  }

  presentPopover(event, info): void{
    this.presentPopoverTrigger.next({event, info})
  }

  get getPage(): number{
    return (this.from === 'set') ? this.page + 21 : this.page;
  }


}
