import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-poper',
  template: `
  <ion-list>
    <ion-item detail (click)="send(true)">
      <ng-container *ngIf="option === 'save'">{{ 'COMMON.SAVE' | translate }}</ng-container>
      <ng-container *ngIf="option === 'delete'">{{ 'COMMON.DELETE' | translate }}</ng-container>
    </ion-item>
    <ion-item detail button (click)="send(false)">{{ 'COMMON.CLOSE' | translate }}</ion-item>
  </ion-list>
  `,
  styleUrls: ['poper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverComponent {

  option: string = '';


  constructor(private navParams: NavParams, public popoverController: PopoverController) {
    this.option = this.navParams.get('button')
  }


  send(bool:boolean): void{
    this.popoverController.dismiss(bool)
  }
}
