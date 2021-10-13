import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-poper',
  template: `
  <ion-list>
    <!-- <ion-list-header>Ionic</ion-list-header> -->
    <ion-item button (click)="send(true)">{{ 'COMMON.SAVE' | translate }}</ion-item>
    <!-- <ion-item button>Documentation</ion-item>
    <ion-item button>Showcase</ion-item>
    <ion-item button>GitHub Repo</ion-item> -->
    <ion-item lines="none" detail="false" button (click)="send(false)">{{ 'COMMON.CLOSE' | translate }}</ion-item>
  </ion-list>
  `,
  styleUrls: ['poper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoperComponent {

  constructor( public popoverController: PopoverController) { }


  send(bool:boolean): void{
    this.popoverController.dismiss(bool)
  }
}
