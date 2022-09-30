import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
          [defaultHref]="redirectoTo(currentSection)"
          [text]="''">
        </ion-back-button>

        <ion-title
          class="text-color"
          slot="start">
          {{ 'COMMON.TITLE' | translate }}
        </ion-title>

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
      const [,,setName] =  url?.split('/') || [];

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
    private menu: MenuController,
    private router: Router
  ) {}


  redirectoTo(currentSection:any): string{
    const { route = null} = currentSection || {};
    // console.log(currentSection)
    // console.log(route)
    if(route === 'set') return '/sets'
    return '/home';
  }

  open() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  redirectTo(passage: string): void{
    this.router.navigate(['/chapter/'+passage])
    this.menu.close('first')
  }

  openEnd() {
    this.menu.close();
  }

}
// '/home':{label:'COMMON.TITLE', route:'home'},
// '/cards':{label:'COMMON.CARDS', route:'cards'},
// '/sets': {label:'COMMON.SETS', route:'sets'},
// // '/set': {label:'COMMON.SET', route:'set'},
// '/storage':{label:'COMMON.SAVED_CARDS', route:'storage'},
// '/banlist':{label:'COMMON.BANLIST', route:'banlist'},
