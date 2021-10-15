import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent, IonInfiniteScroll, Platform, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { fromFilter } from '@ygopro/shared/filter';
import { PoperComponent } from '@ygopro/shared/generics/components/poper.component';
import { Card } from '@ygopro/shared/shared/models';
import { emptyObject, errorImage, gotToTop, trackById } from '@ygopro/shared/shared/utils/utils';
import { StorageActions } from '@ygopro/shared/storage';
import { fromTrap, TrapActions } from '@ygopro/shared/trap';
import { map, startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-trap-card',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
    <div class="container components-color-second">

      <div class="header" no-border>
        <div class="header-container-empty" ></div>
        <h1 class="text-second-color">{{'COMMON.TRAP_CARDS' | translate}}</h1>
        <div class="header-container-empty"></div>
      </div>


      <ng-container *ngIf="(traps$ | async) as traps">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'|| statusComponent?.offset !== 0; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <form (submit)="searchSubmit($event)" class="fade-in-card">
                <ion-searchbar color="light" [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
              </form>

              <ng-container *ngIf="(mosterFormats$ | async) as mosterFormats">
                  <ion-item *ngIf="mosterFormats?.length > 0" class="fade-in-card item-select font-medium width-84">
                    <ion-label>{{'COMMON.FILTER_BY_FORMAT' | translate}}</ion-label>
                    <ion-select (ionChange)="changeFilter($any($event), 'format')" [value]="statusComponent?.format" interface="action-sheet">
                      <ion-select-option *ngFor="let format of mosterFormats" [value]="format">{{format}}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ng-container>

              <ng-container *ngIf="(trapsRace$ | async) as trapsRace">
                <ion-item *ngIf="trapsRace?.length > 0" class="fade-in-card item-select font-medium width-84">
                  <ion-label>{{'COMMON.FILTER_BY_RACE' | translate}}</ion-label>
                  <ion-select (ionChange)="changeFilter($any($event), 'race')" [value]="statusComponent?.race" interface="action-sheet">
                    <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                    <ion-select-option *ngFor="let race of trapsRace" [value]="race">{{race}}</ion-select-option>
                  </ion-select>
                </ion-item>
              </ng-container>

              <ng-container *ngIf="traps?.length > 0; else noData">

                <ng-container *ngFor="let trap of traps; trackBy: trackById">
                  <ion-card class="ion-activatable ripple-parent" [routerLink]="['/card/'+trap?.id]" ion-long-press [interval]="700" (pressed)="presentPopover($event, trap)">
                    <img [src]="trap?.card_images[0]?.image_url" loading="lazy" (error)="errorImage($event)">

                    <ng-container *ngIf="emptyObject(trap?.banlist_info)">
                      <div class="banlist-div">
                        <div *ngIf="!!trap?.banlist_info?.ban_tcg" class="card-result span-bold font-medium">
                          <span [ngClass]="{'forbidden': trap?.banlist_info?.ban_tcg === 'Banned', 'limited': trap?.banlist_info?.ban_tcg === 'Limited', 'semi-limited': trap?.banlist_info?.ban_tcg === 'Semi-Limited'}">{{ 'COMMON.TCG' | translate}}: </span>
                          <ng-container *ngIf="trap?.banlist_info?.ban_tcg === 'Banned'"><img [src]="banned"/></ng-container>
                          <ng-container *ngIf="trap?.banlist_info?.ban_tcg === 'Limited'"><img [src]="limited"/></ng-container>
                          <ng-container *ngIf="trap?.banlist_info?.ban_tcg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                        </div>
                        <div *ngIf="!!trap?.banlist_info?.ban_ocg" class="card-result span-bold font-medium">
                          <span [ngClass]="{'forbidden': trap?.banlist_info?.ban_ocg === 'Banned', 'limited': trap?.banlist_info?.ban_ocg === 'Limited', 'semi-limited': trap?.banlist_info?.ban_ocg === 'Semi-Limited'}">{{ 'COMMON.OCG' | translate}}: </span>
                          <ng-container *ngIf="trap?.banlist_info?.ban_ocg === 'Banned'"><img [src]="banned"/></ng-container>
                          <ng-container *ngIf="trap?.banlist_info?.ban_ocg === 'Limited'"><img [src]="limited"/></ng-container>
                          <ng-container *ngIf="trap?.banlist_info?.ban_ocg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                        </div>
                      </div>
                    </ng-container>

                    <!-- RIPPLE EFFECT  -->
                    <ion-ripple-effect></ion-ripple-effect>
                  </ion-card>
                </ng-container>

                <!-- INFINITE SCROLL  -->
                <ng-container *ngIf="(total$ | async) as total">
                  <ng-container *ngIf="(statusComponent?.offset + 21) <= total">
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
  styleUrls: ['./trap-card.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrapCardPage {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent
  infiniteScroll$ = new EventEmitter<{fname:string, offset:number, race:string, format:string}>();
  banned = '../../../assets/images/Banned.png';
  limited = '../../../assets/images/Limited.png';
  semiLimited = '../../../assets/images/Semi-limited.png';

  search = new FormControl('');
  showButton: boolean = false;
  statusComponent = {
    fname:'',
    offset:0,
    race:'',
    format:'',
  };

  mosterFormats$ = this.store.select(fromFilter.getFormats);
  trapsRace$ = this.store.select(fromFilter.getRaces).pipe(
    map(races => (races || [])?.filter(item => item === 'Normal' || item === 'Continuous' || item === 'Counter'))
  );

  status$ = this.store.select(fromTrap.getStatusTraps);
  total$ = this.store.select(fromTrap.getTotal);

  traps$ = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    tap(({fname, offset, race, format}) => {
      if(format === 'normal') format = '';
      this.store.dispatch(TrapActions.loadTraps({fname, offset, race, format}))
    }),
    switchMap(() =>
      this.store.select(fromTrap.getTraps)
    )
  );


  constructor(
    private store: Store,
    public platform: Platform,
    public popoverController: PopoverController
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
      this.statusComponent = {...this.statusComponent, offset:(this.statusComponent?.offset + 21) };

      if(this.statusComponent?.offset >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }

      this.infiniteScroll$.next(this.statusComponent)
      event.target.complete();
    }, 500);
  }

  // FILTER
  changeFilter({detail: {value}}, filter): void{
    this.statusComponent = {...this.statusComponent, offset:0, [filter]: value};

    this.infiniteScroll$.next(this.statusComponent)
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.statusComponent = {...this.statusComponent, fname:'', offset:0, race:'', format:''};
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

      event.target.complete();
    }, 500);
  }

  async presentPopover(ev: any, info: Card) {
    const popover = await this.popoverController.create({
      component: PoperComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps:{
        button:'save'
      }
    });
    await popover.present();

    const { role, data } = await popover.onDidDismiss();
    if(data) this.store.dispatch(StorageActions.saveCard({card:info}))
  }


}
