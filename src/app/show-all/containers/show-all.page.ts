import { ChangeDetectionStrategy, Component, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { fromSet } from '@ygopro/shared/set';
import { gotToTop } from '@ygopro/shared/utils/helpers/functions';
import { tap, switchMap, map } from 'rxjs/operators';
import { Keyboard } from '@capacitor/keyboard';


@Component({
  selector: 'app-show-all',
  template:`
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color-third displays-center">
        <!-- FORM  -->
        <form (submit)="searchSubmit($event)">
          <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
        </form>
      </div>

      <div class="container components-color-second">

        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending'; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">
                <ng-container *ngIf="info?.sets?.length > 0; else noData">

                  <app-generic-card *ngFor="let set of info?.sets"
                    [item]="set"
                    [from]="'sets'">
                  </app-generic-card>

                  <!-- INFINITE SCROLL  -->
                  <app-infinite
                    [slice]="info?.sets?.length"
                    [status]="status"
                    [total]="info?.total"
                    (loadDataTrigger)="loadData($event)">
                  </app-infinite>

                </ng-container>
              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>

        <!-- REFRESH -->
        <!-- <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher> -->

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

  gotToTop = gotToTop;

  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;

  search = new FormControl('');
  showButton: boolean = false;

  status$ = this.store.select(fromSet.getStatus);
  infiniteScroll = new EventEmitter<{set:string, slice:number, search:string}>();
  statusComponent = {
    slice:10,
    search:'',
    set:''
  };
  info$ = this.infiniteScroll.pipe(
    switchMap(({set, slice, search}) =>
      this.store.select(fromSet.getSets).pipe(
        map(sets => {
          const selectedSets = sets?.[set]
          const updateSelectedSet = !search
                              ? selectedSets
                              : selectedSets?.filter(({set_name}) => set_name?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()) )
          return {
            sets: updateSelectedSet?.slice(0, slice),
            total: selectedSets?.length
          }
        })
      )
    )
    ,tap(d => console.log(d))
  );


  constructor(
    private route: ActivatedRoute,
    private store: Store,
    public platform: Platform,
  ) { }


  ionViewWillEnter(): void{
    this.statusComponent = { ...this.statusComponent, set: this.route.snapshot.params?.date };
    this.infiniteScroll.next(this.statusComponent);
  }

  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {...this.statusComponent, search: this.search.value, slice: 10 };
    this.infiniteScroll.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {...this.statusComponent,  search: '', slice: 20 };
    this.infiniteScroll.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    this.statusComponent = { ...this.statusComponent, slice: this.statusComponent?.slice + 10 };
    this.infiniteScroll.next(this.statusComponent);
    event.target.complete();
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }
}
