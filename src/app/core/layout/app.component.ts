import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NotificationModal } from '@ygopro/shared-ui/notification-modal/notification-modal.page';
import { trackById } from '@ygopro/shared/utils/functions';
import { filter, map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template:`
  <ion-app >
    <!-- HEADER  -->
    <ion-header class="ion-no-border">
      <ion-toolbar *ngIf="(currentSection$ | async) as currentSection">

        <ion-back-button
          *ngIf="!isNotShowBackButtons?.includes(currentSection?.route)"
          class="text-color"
          slot="start"
          [defaultHref]="redirectTo(currentSection)"
          [text]="''">
        </ion-back-button>

        <ion-title
          class="text-color"
          slot="start">
          {{ 'COMMON.TITLE' | translate }}
        </ion-title>

        <ion-icon
          class="text-color"
          slot="end"
          name="ellipsis-horizontal-outline"
          (click)="presentModal()">
        </ion-icon>
      </ion-toolbar>
    </ion-header>

   <!-- RUTER  -->
   <ion-router-outlet id="main"></ion-router-outlet>

 </ion-app>
 `,
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  trackById = trackById;
  isNotShowBackButtons = ['home'];
  lateralMenu = [
    { id:1, link:'home', text:'COMMON.SETS', icon:'home-outline' },
    { id:2, link:'search', text:'COMMON.SEARCH_PAGE', icon:'search-outline' },
    { id:3, link:'banlist', text:'COMMON.BANLIST', icon:'close-circle-outline' },
    { id:4, link:'storage', text:'COMMON.SAVED_CARDS', icon:'bookmark-outline' }
  ];

  currentSection$= this.router.events.pipe(
    filter((event) => event instanceof NavigationStart),
    map((event: NavigationEnd) => {
      const { url = ''} = event || {};
      // const [,,setName] =  url?.split('/') || [];

      // if(url?.includes('/set/')) return {label:setName?.replace(/%20/g,' '), route:'set'};
      if(url?.includes('/set/')) return {label: 'COMMON.TITLE', route:'set'};

      return {
        '/home':{label:'COMMON.TITLE', route:'home'},
        '/cards':{label:'COMMON.TITLE', route:'cards'},
        '/sets': {label:'COMMON.TITLE', route:'sets'},
        '/storage':{label:'COMMON.TITLE', route:'storage'},
        '/banlist':{label:'COMMON.TITLE', route:'banlist'},
      }[url] || {llabel:'COMMON.TITLE', route:'home'}
    })
    ,shareReplay(1)
  );


  constructor(
    private router: Router,
    public modalController: ModalController,
  ) {}


  redirectTo(currentSection:any): string{
    const { route = null} = currentSection || {};
    if(route === 'set') return '/sets'
    return '/home';
  }

  // OPEN FILTER MODAL
  async presentModal() {
    const modal = await this.modalController.create({
      component: NotificationModal,
    });

    modal.present();
    await modal.onDidDismiss();
  }



}
