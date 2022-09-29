import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Filter } from '@ygopro/shared/card';
import { trackById } from '@ygopro/shared/utils/functions';

@Component({
  selector: 'app-modal-filter',
  template:`
  <ion-content class="modal-wrapper components-color-second">
    <ion-header translucent class="ion-no-border  components-color-third">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="dismissModal()"><ion-icon name="close-outline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <div class="displays-around modal-container">

      <ng-container *ngIf="!yearFilter">
        <ng-container *ngIf="cardFormat && !bool">
          <ion-item *ngIf="cardFormat?.length > 0" class="item-select font-medium">
            <ion-label>{{'COMMON.FILTER_BY_FORMAT' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'format')" [value]="getFormatSelectorValue()" interface="action-sheet">
              <ion-select-option *ngFor="let format of cardFormat; trackBy: trackById" [value]="format">{{format}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="archetype && !bool">
          <ion-item *ngIf="archetype?.length > 0" class="item-select font-medium">
            <ion-label>{{'COMMON.FILTER_BY_ARCHETYPE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'archetype')" [value]="getArchetypeSelectorValue()" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let format of archetype; trackBy: trackById" [value]="format">{{format}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="selectorTypes && showTypesFilter">
          <ion-item *ngIf="selectorTypes?.length > 0" class="item-select font-medium">
            <ion-label>{{'COMMON.FILTER_BY_TYPE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'type')" [value]="getTypeSelectorValue()" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let type of selectorTypes; trackBy: trackById" [value]="type">{{type}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="orderFilter">
          <ion-item *ngIf="orderFilter?.length > 0" class="item-select font-medium">
            <ion-label>{{'COMMON.ORDER' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'order')" [value]="getAscDescSelectorValue()" interface="action-sheet">
              <ion-select-option *ngFor="let format of orderFilter; trackBy: trackById" [value]="format">{{format}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="yearFilter">
        <ion-item *ngIf="yearFilter?.length > 0" class="item-select font-medium">
          <ion-label>{{'COMMON.YEAR' | translate}}</ion-label>
          <ion-select (ionChange)="changeFilter($any($event), 'year')" [value]="getYearValue()" interface="action-sheet">
            <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
            <ion-select-option *ngFor="let year of yearFilter; trackBy: trackById" [value]="year">{{year}}</ion-select-option>
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

  trackById = trackById;
  @Input() statusComponent: {page?:string, filter?:(Filter & {order:string} & {year:string}) } = {};
  @Input() cardType: string[];
  @Input() yearFilter: string[];
  @Input() archetype: string[];
  @Input() cardFormat: string[];
  @Input() orderFilter: string[];
  @Input() bool: boolean = false;
  @Input() showTypesFilter: boolean = true;
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

  getArchetypeSelectorValue(): string{
    return (!this.statusComponent?.filter?.archetype) ? '' : this.statusComponent?.filter?.archetype;
  }

  getYearValue(): string{
    return this.statusComponent?.filter?.year
  }

  getAscDescSelectorValue(): string{
    return this.statusComponent?.filter?.order
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
