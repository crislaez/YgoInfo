import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { IonContent, ModalController, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CardModalComponent } from '@ygopro/shared-ui/card-modal/card-modal.component';
import { PopoverComponent } from '@ygopro/shared-ui/popover/poper.component';
import { Card } from '@ygopro/shared/models';
import { fromStorage, StorageActions } from '@ygopro/shared/storage';
import { errorImage, gotToTop, isNotEmptyObject, trackById } from '@ygopro/shared/utils/functions';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { BANNED, LIMIT, SEMI_LIMIT } from './../../../shared/utils/functions';

@Component({
  selector: 'ygopro-storage',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header text-color">
      <div class="empty-div-50"> </div>
      <h1 class="padding-top-10">{{ 'COMMON.SAVE' | translate }}
      </h1>
    </div>

    <div class="container components-color-second">
      <ng-container *ngIf="(storageCards$ | async) as storageCards">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">
              <ng-container *ngIf="storageCards?.length > 0; else noData">

                <ygopro-card-component
                  *ngFor="let card of storageCards; let i = index; trackBy: trackById"
                  [card]="card"
                  [isSetName]="null"
                  [from]="'storage'"
                  (openSingleCardModal)="openSingleCardModal($event)"
                  (presentPopoverTrigger)="presentPopover($event)">
                </ygopro-card-component>

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
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'30vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'30vh'"></app-no-data>
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
  styleUrls: ['./storage.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoragePage {

  LIMIT = LIMIT;
  BANNED = BANNED;
  SEMI_LIMIT = SEMI_LIMIT;
  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  isNotEmptyObject = isNotEmptyObject;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton: boolean = false;
  ionInfiniteScroll$ = new EventEmitter<string>();

  status$ = this.store.select(fromStorage.getStatus);
  storageCards$ = this.ionInfiniteScroll$.pipe(
    startWith(''),
    tap(() => {
      this.store.dispatch(StorageActions.loadStorage())
    }),
    switchMap(() =>
      this.store.select(fromStorage.getStorage)
    )
  );


  constructor(
    private store: Store,
    public popoverController: PopoverController,
    public modalController: ModalController
  ) { }


  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
    this.ionInfiniteScroll$.next('')

      event.target.complete();
    }, 500);
  }

  // SHOW SINGLE CARD
  async openSingleCardModal(card: Card) {
    const modal = await this.modalController.create({
      component: CardModalComponent,
      componentProps:{
        card
      }
    });
    return await modal.present();
  }

  async presentPopover({event, info}) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: event,
      translucent: true,
      componentProps:{
        button:'delete' //parametro que enviamos
      }
    });
    await popover.present();

    const { role, data } = await popover.onDidDismiss();
    if(!data) return;

    const {id = null} = info || {};
    this.store.dispatch(StorageActions.deleteCard({id}))
  }

}
