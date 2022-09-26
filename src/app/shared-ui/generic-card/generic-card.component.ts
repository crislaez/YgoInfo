import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { errorImage, sliceText } from '@ygopro/shared/utils/functions';


@Component({
  selector: 'app-generic-card',
  template:`
    <ion-card class="line-card displays-between ion-activatable ripple-parent" (click)="onClick()">
      <div class="line-card-image">
        <!-- <ion-img [src]="item?.image" loading="lazy" (ionError)="errorImage($event)"></ion-img> -->
        <ion-label *ngIf="item?.set_code">{{ item?.set_code }}</ion-label>
      </div>

      <div class="width-70">
        <ion-label *ngIf="item?.set_name">{{ sliceText(item?.set_name, 30) }}</ion-label>
      </div>

      <div class="margin-right-5">
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </div>

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
  @Output() openSingleCardModal = new EventEmitter<any>();


  constructor(
    private router: Router
  ) { }


  onClick(): void{
    if(this.from === 'sets') this.router.navigate(['/set/' + this.item?.set_name])
  }

}

