import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '@ygopro/shared/models';
import { errorImage, sliceText, trackById } from '@ygopro/shared/utils/functions';


@Component({
  selector: 'app-set-list',
  template:`
  <ion-list class="set-card-wrapper">
    <ion-item detail *ngFor="let item of items; let i = index; trackBy: trackById" (click)="openSingleCardModal.next(item)" ion-long-press [interval]="400" (pressed)="presentPopover($event, item)">
      <ion-img [src]="getImgage(item?.card_images)" loading="lazy" (ionError)="errorImage($event)"></ion-img>
      <ion-label *ngIf="item?.name" >{{ sliceText(item?.name, 25) }}</ion-label>
    </ion-item>
  </ion-list>
  `,
  styleUrls: ['./set-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetListComponent {

  trackById = trackById;
  errorImage = errorImage;
  sliceText = sliceText;

  @Input() items:any;
  @Output() openSingleCardModal = new EventEmitter<Card>();
  @Output() presentPopoverTrigger = new EventEmitter<{event, info}>();


  constructor() { }


  getImgage(card_images: any[]): string{
    return card_images?.[0]?.image_url_small || card_images?.[0]?.image_url;
  }

  presentPopover(event, info): void{
    this.presentPopoverTrigger.next({event, info})
  }


}
