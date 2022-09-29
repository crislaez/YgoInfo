import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import { gotToTop, trackById, appColors } from '@ygopro/shared/utils/functions';


@Component({
  selector: 'ygopro-home',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color displays-center">
      </div>

      <div class="container components-color">
        <div
          *ngFor="let item of iteratable; let i = index; trackBy: trackById"
          [routerLink]="[item?.link]"
          class="home-div displays-center"
          [ngStyle]="{'background':appColors?.[i]}">
          <div>
            {{ item?.label | translate }}
          </div>
        </div>
      </div>

      <!-- TO TOP BUTTON  -->
      <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  gotToTop = gotToTop;
  appColors = appColors;
  trackById = trackById;
  @ViewChild(IonContent, {static: true}) content: IonContent;

  showButton: boolean = false;
  iteratable = [
    {id:1, label:'COMMON.SETS', link:'/sets'},
    {id:2, label:'COMMON.CARDS', link:'/cards'},
    {id:3, label:'COMMON.BANLIST', link:'/banlist'},
    {id:4, label:'COMMON.SAVE', link:'/storage'},
  ];


  constructor(
    public platform: Platform,
    public modalController: ModalController
  ) { }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }



}
