import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

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
      <ng-container *ngIf="containerName === 'monster'">
        <ng-container *ngIf="monsterFormat">
          <ion-item *ngIf="monsterFormat?.length > 0" class="fade-in-card item-select font-medium width-84 font-small">
            <ion-label>{{'COMMON.FILTER_BY_FORMAT' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'format')" [value]="statusComponentMonster?.format" interface="action-sheet">
              <ion-select-option *ngFor="let format of monsterFormat" [value]="format">{{format}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="monsterLevel">
          <ion-item *ngIf="monsterLevel?.length > 0" class="fade-in-card item-select font-medium width-84 font-small">
            <ion-label>{{'COMMON.FILTER_BY_LEVEL' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'level')" [value]="statusComponentMonster?.level" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let level of monsterLevel" [value]="level">{{level}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="monsterType">
          <ion-item *ngIf="monsterType?.length > 0" class="fade-in-card item-select font-medium width-84 font-small">
            <ion-label>{{'COMMON.FILTER_BY_TYPE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'type')" [value]="statusComponentMonster?.typeCard" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let type of monsterType" [value]="type">{{type}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="monsterArchetypes">
          <ion-item *ngIf="monsterArchetypes?.length > 0" class="fade-in-card item-select font-medium width-84 font-small">
            <ion-label>{{'COMMON.FILTER_BY_ARCHETYPE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'archetype')" [value]="statusComponentMonster?.archetype" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let archetype of monsterArchetypes" [value]="archetype">{{archetype}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="monsterAttributes">
          <ion-item *ngIf="monsterAttributes?.length > 0" class="fade-in-card item-select font-medium width-84 font-small">
            <ion-label>{{'COMMON.FILTER_BY_ATTIBUTE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'attribute')" [value]="statusComponentMonster?.attribute" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let attribute of monsterAttributes" [value]="attribute">{{attribute}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="monsterRace">
          <ion-item *ngIf="monsterRace?.length > 0" class="fade-in-card item-select font-medium width-84 font-small">
            <ion-label>{{'COMMON.FILTER_BY_RACE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'race')" [value]="statusComponentMonster?.race" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let race of monsterRace" [value]="race">{{race}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

      </ng-container>

      <ng-container *ngIf="containerName === 'magic'">
        <ng-container *ngIf="magicFormat">
          <ion-item *ngIf="magicFormat?.length > 0" class="fade-in-card item-select font-medium width-84">
            <ion-label>{{'COMMON.FILTER_BY_FORMAT' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'format')" [value]="statusComponentMagic?.format" interface="action-sheet">
              <ion-select-option *ngFor="let format of magicFormat" [value]="format">{{format}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="magicRacer">
          <ion-item *ngIf="magicRacer?.length > 0" class="fade-in-card item-select font-medium width-84">
            <ion-label>{{'COMMON.FILTER_BY_RACE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'race')" [value]="statusComponentMagic?.race" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let race of magicRacer" [value]="race">{{race}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="containerName === 'trap'">
        <ng-container *ngIf="trapFormat">
          <ion-item *ngIf="trapFormat?.length > 0" class="fade-in-card item-select font-medium width-84">
            <ion-label>{{'COMMON.FILTER_BY_FORMAT' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'format')" [value]="statusComponentTrap?.format" interface="action-sheet">
              <ion-select-option *ngFor="let format of trapFormat" [value]="format">{{format}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="trapRace">
          <ion-item *ngIf="trapRace?.length > 0" class="fade-in-card item-select font-medium width-84">
            <ion-label>{{'COMMON.FILTER_BY_RACE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event), 'race')" [value]="statusComponentTrap?.race" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let race of trapRace" [value]="race">{{race}}</ion-select-option>
            </ion-select>
          </ion-item>
        </ng-container>
      </ng-container>

    </div>

  </ion-content>
  `,
  styleUrls: ['./modal-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalFilterComponent {

  @Input() containerName: string;

  @Input() statusComponentMonster: {fname?:string, offset?:number, archetype?:string, attribute?:string, race?:string, typeCard?:string, format?:string, level?:string} = {};
  @Input() monsterFormat: string[] = [];
  @Input() monsterLevel: string[] = [];
  @Input() monsterType: string[] = [];
  @Input() monsterArchetypes: string[] = [];
  @Input() monsterAttributes: string[] = [];
  @Input() monsterRace: string[] = [];

  @Input() statusComponentMagic: {fname?:string, offset?:number, race?:string, format?:string} = {};
  @Input() magicFormat: string[] = [];
  @Input() magicRacer: string[] = [];

  @Input() statusComponentTrap: {fname?:string, offset?:number, race?:string, format?:string} = {};
  @Input() trapFormat: string[] = [];
  @Input() trapRace: string[] = [];


  constructor(
    public modalController: ModalController
  ) { }


  dismissModal() {
    this.modalController.dismiss(false);
  }

  changeFilter({detail: {value}}, filter): void{
    let componentStatus = {
      ...(Object.keys(this.statusComponentMonster || {})?.length > 0 ? this.statusComponentMonster : {}),
      ...(Object.keys(this.statusComponentMagic || {})?.length > 0 ? this.statusComponentMagic : {}),
      ...(Object.keys(this.statusComponentTrap || {})?.length > 0 ? this.statusComponentTrap : {})
    };

    if(filter === 'type') componentStatus = {...componentStatus, offset:0, typeCard: value};
    else componentStatus = {...componentStatus, offset:0, [filter]: value};

    console.log(componentStatus)
    this.modalController.dismiss(componentStatus);
  }


}
