import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { fromFilter } from '@ygopro/shared/filter';
import { fromMonster, MonsterActions } from '@ygopro/shared/monster';
import { errorImage, gotToTop, trackById, emptyObject } from '@ygopro/shared/shared/utils/utils';
import { map, startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-monster-card',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="container components-color-second">

        <div class="header" no-border>
          <div class="header-container-empty" ></div>
          <h1 class="text-second-color">{{'COMMON.MONSTER_CARDS' | translate}}</h1>
          <div class="header-container-empty"></div>
        </div>

        <ng-container *ngIf="(mosters$ | async) as monsters">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || statusComponent?.offset !== 0; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">

                <form (submit)="searchSubmit($event)" class="fade-in-card">
                  <ion-searchbar color="light" [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
                </form>

                <ng-container *ngIf="(mosterFormats$ | async) as mosterFormats">
                  <ion-item *ngIf="mosterFormats?.length > 0" class="fade-in-card item-select font-medium width-40">
                    <ion-label>{{'COMMON.FILTER_BY_FORMAT' | translate}}</ion-label>
                    <ion-select (ionChange)="changeFilter($any($event), 'format')" [value]="statusComponent?.format" interface="action-sheet">
                      <ion-select-option *ngFor="let format of mosterFormats" [value]="format">{{format}}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ng-container>

                <ng-container *ngIf="(monsterLevels$ | async) as monsterLevels">
                  <ion-item *ngIf="monsterLevels?.length > 0" class="fade-in-card item-select font-medium width-40">
                    <ion-label>{{'COMMON.FILTER_BY_LEVEL' | translate}}</ion-label>
                    <ion-select (ionChange)="changeFilter($any($event), 'level')" [value]="statusComponent?.level" interface="action-sheet">
                      <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                      <ion-select-option *ngFor="let level of monsterLevels" [value]="level">{{level}}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ng-container>

                <ng-container *ngIf="(monstersType$ | async) as monstersType">
                  <ion-item *ngIf="monstersType?.length > 0" class="fade-in-card item-select font-medium width-40">
                    <ion-label>{{'COMMON.FILTER_BY_TYPE' | translate}}</ion-label>
                    <ion-select (ionChange)="changeFilter($any($event), 'type')" [value]="statusComponent?.typeCard" interface="action-sheet">
                      <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                      <ion-select-option *ngFor="let type of monstersType" [value]="type">{{type}}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ng-container>

                <ng-container *ngIf="(monstersArchetypes$ | async) as monstersArchetypes">
                  <ion-item *ngIf="monstersArchetypes?.length > 0" class="fade-in-card item-select font-medium width-40">
                    <ion-label>{{'COMMON.FILTER_BY_ARCHETYPE' | translate}}</ion-label>
                    <ion-select (ionChange)="changeFilter($any($event), 'archetype')" [value]="statusComponent?.archetype" interface="action-sheet">
                      <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                      <ion-select-option *ngFor="let archetype of monstersArchetypes" [value]="archetype">{{archetype}}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ng-container>

                <ng-container *ngIf="(monstersAttributes$ | async) as monstersAttributes">
                  <ion-item *ngIf="monstersAttributes?.length > 0" class="fade-in-card item-select font-medium width-40">
                    <ion-label>{{'COMMON.FILTER_BY_ATTIBUTE' | translate}}</ion-label>
                    <ion-select (ionChange)="changeFilter($any($event), 'attribute')" [value]="statusComponent?.attribute" interface="action-sheet">
                      <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                      <ion-select-option *ngFor="let attribute of monstersAttributes" [value]="attribute">{{attribute}}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ng-container>

                <ng-container *ngIf="(monstersRaces$ | async) as monstersRaces">
                  <ion-item *ngIf="monstersRaces?.length > 0" class="fade-in-card item-select font-medium width-40">
                    <ion-label>{{'COMMON.FILTER_BY_RACE' | translate}}</ion-label>
                    <ion-select (ionChange)="changeFilter($any($event), 'race')" [value]="statusComponent?.race" interface="action-sheet">
                      <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                      <ion-select-option *ngFor="let race of monstersRaces" [value]="race">{{race}}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ng-container>

                <ng-container *ngIf="monsters?.length > 0; else noData">

                  <ng-container *ngFor="let monster of monsters; trackBy: trackById">
                    <ion-card class="ion-activatable ripple-parent" [routerLink]="['/card/'+monster?.id]">
                      <img [src]="monster?.card_images[0]?.image_url" loading="lazy" (error)="errorImage($event)">

                      <ng-container *ngIf="emptyObject(monster?.banlist_info)">
                        <div class="banlist-div">
                          <div *ngIf="!!monster?.banlist_info?.ban_tcg" class="card-result span-bold font-medium">
                            <span [ngClass]="{'forbidden': monster?.banlist_info?.ban_tcg === 'Banned', 'limited': monster?.banlist_info?.ban_tcg === 'Limited', 'semi-limited': monster?.banlist_info?.ban_tcg === 'Semi-Limited'}">{{ 'COMMON.TCG' | translate}}: </span>
                            <ng-container *ngIf="monster?.banlist_info?.ban_tcg === 'Banned'"><img [src]="banned"/></ng-container>
                            <ng-container *ngIf="monster?.banlist_info?.ban_tcg === 'Limited'"><img [src]="limited"/></ng-container>
                            <ng-container *ngIf="monster?.banlist_info?.ban_tcg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                          </div>
                          <div *ngIf="!!monster?.banlist_info?.ban_ocg" class="card-result span-bold font-medium">
                            <span [ngClass]="{'forbidden': monster?.banlist_info?.ban_ocg === 'Banned', 'limited': monster?.banlist_info?.ban_ocg === 'Limited', 'semi-limited': monster?.banlist_info?.ban_ocg === 'Semi-Limited'}">{{ 'COMMON.OCG' | translate}}: </span>
                            <ng-container *ngIf="monster?.banlist_info?.ban_ocg === 'Banned'"><img [src]="banned"/></ng-container>
                            <ng-container *ngIf="monster?.banlist_info?.ban_ocg === 'Limited'"><img [src]="limited"/></ng-container>
                            <ng-container *ngIf="monster?.banlist_info?.ban_ocg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                          </div>
                        </div>
                      </ng-container>

                      <!-- RIPPLE EFFECT  -->
                      <ion-ripple-effect></ion-ripple-effect>
                    </ion-card>
                  </ng-container>

                  <!-- INFINITE SCROLL  -->
                  <ng-container *ngIf="(total$ | async) as total">
                    <ng-container *ngIf="(statusComponent?.offset + 20) < total">
                      <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                        <ion-infinite-scroll-content color="primary" class="loadingspinner">
                        </ion-infinite-scroll-content>
                      </ion-infinite-scroll>
                    </ng-container>
                  </ng-container>

                </ng-container>

              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>


        <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <!-- IS ERROR -->
        <ng-template #serverError>
          <div class="error-serve">
            <div>
              <span><ion-icon class="text-second-color big-size" name="cloud-offline-outline"></ion-icon></span>
              <br>
              <span class="text-second-color">{{'COMMON.ERROR' | translate}}</span>
            </div>
          </div>
        </ng-template>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <div class="error-serve">
            <span class="text-second-color">{{'COMMON.NORESULT' | translate}}</span>
          </div>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <ion-spinner class="loadingspinner"></ion-spinner>
        </ng-template>
      </div>

      <!-- TO TOP BUTTON  -->
      <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./monster-card.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonsterCardPage {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  infiniteScroll$ = new EventEmitter<{fname?:string, offset:number, archetype?:string, attribute?:string, race?:string, typeCard?:string, format?:string, level?:string}>();
  banned = '../../../assets/images/Banned.png';
  limited = '../../../assets/images/Limited.png';
  semiLimited = '../../../assets/images/Semi-limited.png';

  search = new FormControl('');
  showButton: boolean = false;
  statusComponent = {
    fname:'',
    offset:0,
    archetype:'',
    attribute:'',
    race:'',
    typeCard:'',
    format:'',
    level:''
  };

  monsterLevels$ = this.store.select(fromFilter.getLevels);
  mosterFormats$ = this.store.select(fromFilter.getFormats);
  monstersAttributes$ = this.store.select(fromFilter.getAttributes);
  monstersArchetypes$ = this.store.select(fromFilter.getArchetypes);
  monstersRaces$ = this.store.select(fromFilter.getRaces).pipe(
    map(races => (races || [])?.filter(item => item !== 'Normal' && item !== 'Field' &&  item !== 'Equip' && item !== 'Continuous' && item !== 'Quick-Play' && item !== 'Ritual' && item !== 'Counter'))
  );
  monstersType$ = this.store.select(fromFilter.getTypes).pipe(
    map(types => (types || []).filter(item => item !== 'Spell Card' && item !== 'Trap Card'))
  );

  status$ = this.store.select(fromMonster.getStatusMonsters);
  total$ = this.store.select(fromMonster.getTotal);

  mosters$ = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    tap(({fname, offset, archetype, attribute, race, typeCard, format, level}) => {
      // console.log(fname, offset, archetype, attribute, race, typeCard, format)
      if(format === 'normal') format = '';
      this.store.dispatch(MonsterActions.loadMonsters({fname, offset, archetype, attribute, race, typeCard, format, level}))
    }),
    switchMap(() =>
      this.store.select(fromMonster.getMonsters)
    )
  );


  constructor(
    private store: Store,
    public platform: Platform
  ) { }


  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {...this.statusComponent, fname:this.search.value, offset:0 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {...this.statusComponent, fname:'', offset:0 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // INIFINITE SCROLL
  loadData(event, total) {
    setTimeout(() => {
      this.statusComponent = {...this.statusComponent, offset:(this.statusComponent?.offset + 20) };

      if(this.statusComponent?.offset >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }

      this.infiniteScroll$.next(this.statusComponent)
      event.target.complete();
    }, 500);
  }

  // FILTER
  changeFilter({detail: {value}}, filter): void{
    if(filter === 'type') this.statusComponent = {...this.statusComponent, offset:0, typeCard: value};
    else this.statusComponent = {...this.statusComponent, offset:0, [filter]: value};

    this.infiniteScroll$.next(this.statusComponent)
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.statusComponent = {...this.statusComponent, fname:'', offset:0, archetype:'', attribute:'', race:'', typeCard:'', format:'', level:''};
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }


}
