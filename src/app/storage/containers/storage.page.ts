import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { IonContent, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { PopoverComponent } from '@ygopro/shared-ui/generics/components/poper.component';
import { emptyObject, errorImage, gotToTop, trackById } from '@ygopro/shared/shared/utils/helpers/functions';
import { Card } from '@ygopro/shared/shared/utils/models';
import { fromStorage, StorageActions } from '@ygopro/shared/storage';
import { startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-storage',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
    <div class="container components-color-second">

      <div class="header" no-border>
        <div class="header-container-empty" ></div>
        <h1 class="text-second-color">{{'COMMON.SAVED_CARDS' | translate}}</h1>
        <div class="header-container-empty"></div>
      </div>

      <ng-container *ngIf="(storageCards$ | async) as storageCards">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">
              <ng-container *ngIf="storageCards?.length > 0; else noData">

                <ng-container *ngFor="let card of storageCards; trackBy: trackById">
                  <ion-card class="ion-activatable ripple-parent" [routerLink]="['/card/'+card?.id]" ion-long-press [interval]="700" (pressed)="presentPopover($event, card)">
                    <img [src]="card?.card_images[0]?.image_url" loading="lazy" (error)="errorImage($event)">

                    <ng-container *ngIf="emptyObject(card?.banlist_info)">
                      <div class="banlist-div">
                        <div *ngIf="!!card?.banlist_info?.ban_tcg" class="card-result span-bold font-medium">
                          <span [ngClass]="{'forbidden': card?.banlist_info?.ban_tcg === 'Banned', 'limited': card?.banlist_info?.ban_tcg === 'Limited', 'semi-limited': card?.banlist_info?.ban_tcg === 'Semi-Limited'}">{{ 'COMMON.TCG' | translate}}: </span>
                          <ng-container *ngIf="card?.banlist_info?.ban_tcg === 'Banned'"><img [src]="banned"/></ng-container>
                          <ng-container *ngIf="card?.banlist_info?.ban_tcg === 'Limited'"><img [src]="limited"/></ng-container>
                          <ng-container *ngIf="card?.banlist_info?.ban_tcg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                        </div>
                        <div *ngIf="!!card?.banlist_info?.ban_ocg" class="card-result span-bold font-medium">
                          <span [ngClass]="{'forbidden': card?.banlist_info?.ban_ocg === 'Banned', 'limited': card?.banlist_info?.ban_ocg === 'Limited', 'semi-limited': card?.banlist_info?.ban_ocg === 'Semi-Limited'}">{{ 'COMMON.OCG' | translate}}: </span>
                          <ng-container *ngIf="card?.banlist_info?.ban_ocg === 'Banned'"><img [src]="banned"/></ng-container>
                          <ng-container *ngIf="card?.banlist_info?.ban_ocg === 'Limited'"><img [src]="limited"/></ng-container>
                          <ng-container *ngIf="card?.banlist_info?.ban_ocg === 'Semi-Limited'"><img [src]="semiLimited"/></ng-container>
                        </div>
                      </div>
                    </ng-container>

                    <!-- RIPPLE EFFECT  -->
                    <ion-ripple-effect></ion-ripple-effect>
                  </ion-card>
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
          <div>
            <span><ion-icon class="text-second-color max-size" name="clipboard-outline"></ion-icon></span>
            <br>
            <span class="text-second-color">{{'COMMON.NO_DATA' | translate}}</span>
          </div>
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
  styleUrls: ['./storage.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoragePage {

  gotToTop = gotToTop;
  errorImage = errorImage;
  trackById = trackById;
  emptyObject = emptyObject;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton: boolean = false;
  banned = '../../../assets/images/Banned.png';
  limited = '../../../assets/images/Limited.png';
  semiLimited = '../../../assets/images/Semi-limited.png';
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

  async presentPopover(ev: any, info: Card) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps:{
        button:'delete' //parametro que enviamos
      }
    });
    await popover.present();

    const { role, data } = await popover.onDidDismiss();
    //data es lo que devolvemos
    if(data){
      const {id = null} = info || {}
      this.store.dispatch(StorageActions.deleteCard({id}))
    }
  }
}
