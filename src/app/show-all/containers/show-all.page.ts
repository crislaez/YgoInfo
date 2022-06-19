import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-show-all',
  template:`
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color-third displays-center">
        <ng-container *ngIf="!['pending','error']?.includes(status$ | async)">
          <!-- FORM  -->
          <!-- <form (submit)="searchSubmit($event)">
            <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
          </form> -->
          <!-- FILTER  -->
          <!-- <ion-button class="displays-center class-ion-button" (click)="presentModal(orderFilter)"><ion-icon name="options-outline"></ion-icon> </ion-button> -->
        </ng-container>
      </div>

      <div class="container components-color-second">


        <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <!-- IS ERROR -->
        <ng-template #serverError>
          <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'30vh'"></app-no-data>
        </ng-template>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'20vh'"></app-no-data>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <app-spinner [top]="'80%'"></app-spinner>
        </ng-template>
      </div>

      <!-- TO TOP BUTTON  -->
      <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./show-all.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowAllPage {

  constructor() { }


}
