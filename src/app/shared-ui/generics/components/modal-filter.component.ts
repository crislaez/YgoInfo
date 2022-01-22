import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Filter } from '@ygopro/shared/card';

@Component({
  selector: 'app-modal-filter',
  template:`
  <ion-content class="modal-wrapper">

    <ion-header class="components-color">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button fill="clear" class="components-color" (click)="dismissModal()"><ion-icon name="close-outline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <div class="displays-around">
      <ng-container *ngIf="cardFormat && !bool">
        <ion-item *ngIf="cardFormat?.length > 0" class="fade-in-card item-select font-medium width-84">
          <ion-label>{{'COMMON.FILTER_BY_FORMAT' | translate}}</ion-label>
          <ion-select (ionChange)="changeFilter($any($event), 'format')" [value]="getFormatSelectorValue()" interface="action-sheet">
            <ion-select-option *ngFor="let format of cardFormat" [value]="format">{{format}}</ion-select-option>
          </ion-select>
        </ion-item>
      </ng-container>

      <ng-container *ngIf="selectorTypes">
        <ion-item *ngIf="selectorTypes?.length > 0" class="fade-in-card item-select font-medium width-84">
          <ion-label>{{'COMMON.FILTER_BY_TYPE' | translate}}</ion-label>
          <ion-select (ionChange)="changeFilter($any($event), 'type')" [value]="getTypeSelectorValue()" interface="action-sheet">
            <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
            <ion-select-option *ngFor="let type of selectorTypes" [value]="type">{{type}}</ion-select-option>
          </ion-select>
        </ion-item>
      </ng-container>

    </div>

  </ion-content>
  `,
  styleUrls: ['./modal-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalFilterComponent {

  @Input() statusComponent: {page?:string, filter?:Filter } = {};
  @Input() cardType: string[];
  @Input() cardFormat: string[];
  @Input() bool: boolean = false;
  selectorTypes: string[] = ['Moster Card', 'Spell Card', 'Trap Card'];


  constructor(
    public modalController: ModalController
  ) { }


  dismissModal() {
    this.modalController.dismiss(false);
  }

  getFormatSelectorValue(): string{
    return (!this.statusComponent?.filter?.format) ? 'normal' : this.statusComponent?.filter?.format;
  }

  getTypeSelectorValue(): string{
    if(!this.statusComponent?.filter?.type) return '';
    return (!this.statusComponent?.filter?.type?.includes('Spell Card') && !this.statusComponent?.filter?.type?.includes('Trap Card'))
    ? 'Moster Card'
    : this.statusComponent?.filter?.type;
  }

  changeFilter({detail: {value}}, filter): void{
    let selectedValue = (filter === 'type' && value === 'Moster Card')
    ? (this.cardType || [])?.filter(item => (item !== 'Spell Card' && item !== 'Trap Card'))?.join(',')
    : value;

    selectedValue = (filter === 'format' && value === 'normal') ? '' : selectedValue

    let componentStatus = {
      ...this.statusComponent,
      page: 0,
      filter:{
        ...(this.statusComponent.filter ? this.statusComponent.filter : {}),
        [filter]: selectedValue
      }
    };

    this.modalController.dismiss(componentStatus);
  }


}
