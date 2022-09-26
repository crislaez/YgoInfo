import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { getSliderConfig, sliceText, trackById } from '@ygopro/shared/utils/functions';
import SwiperCore, { Navigation, Pagination } from 'swiper';

// Pagination
SwiperCore.use([Pagination, Navigation]);


@Component({
  selector: 'app-swiper',
  template:`
    <div class="header margin-top">
      <div class="div-center">
        <h2 class="text-second-color">{{ title }}</h2>
        <span class="text-color-four" *ngIf="showMore && items?.length > 5" (click)="redirect()" >{{ 'COMMON.SHEE_MORE' | translate }}</span>
      </div>
    </div>

    <swiper #swiper effect="fade" [config]="getSliderConfig(items)" >
      <ng-template swiperSlide *ngFor="let set of items?.slice(0, 5); trackBy: trackById" >
        <ion-card class="slide-ion-card ion-activatable ripple-parent" [routerLink]="['/set/'+set?.set_name]" [queryParams]="{name:set?.name}">
          <ion-card-header >
            <span class="big-size-medium span-bold">{{ sliceText(set?.set_name, 25) }}</span>
          </ion-card-header>

          <ion-card-content>
            <p class="font-medium text-center">{{ set?.tcg_date }}</p>
          </ion-card-content>

          <ion-ripple-effect></ion-ripple-effect>
        </ion-card>
      </ng-template>
    </swiper>
  `,
  styleUrls: ['./swiper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwiperComponent {

  sliceText = sliceText;
  getSliderConfig = getSliderConfig;
  trackById = trackById;
  @Input() items: any[]
  @Input() showMore: boolean;
  @Input() key: string;
  @Input() title: string;


  constructor(private router:Router) { }


  redirect(): void{
    if(!!this.key){
      this.router.navigate(['/show-all/'+this.key])
    }
  }


}
