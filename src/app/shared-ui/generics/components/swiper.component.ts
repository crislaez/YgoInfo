import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { getSliderConfig, sliceTestLong, trackById } from '@ygopro/shared/utils/helpers/functions';
import SwiperCore, { Navigation, Pagination } from 'swiper';

// Pagination
SwiperCore.use([Pagination, Navigation]);


@Component({
  selector: 'app-swiper',
  template:`
    <swiper #swiper effect="fade" [config]="getSliderConfig(items)" >
      <ng-template swiperSlide *ngFor="let set of items; trackBy: trackById" >
        <ion-card class="slide-ion-card" [routerLink]="['/set/'+set?.set_name]" [queryParams]="{name:set?.name}">
          <ion-card-header >
            <span class="big-size-medium span-bold">{{ sliceTestLong(set?.set_name) }}</span>
          </ion-card-header>

          <ion-card-content>
            <p class="font-medium text-center">{{ set?.tcg_date }}</p>
          </ion-card-content>
        </ion-card>
      </ng-template>
    </swiper>
  `,
  styleUrls: ['./swiper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwiperComponent {

  sliceTestLong = sliceTestLong;
  getSliderConfig = getSliderConfig;
  trackById = trackById;
  @Input() items: any[]


  constructor() { }


}
