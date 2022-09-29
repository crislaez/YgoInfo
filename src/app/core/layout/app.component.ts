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

        <!-- <ion-button *ngIf="navItems?.includes(currentSection?.label)" fill="clear" size="small" slot="start"  (click)="open()">
          <ion-menu-button class="text-color"></ion-menu-button>
        </ion-button> -->

        <ion-back-button
          *ngIf="!isNotShowBackButtons?.includes(currentSection?.route)"
          class="text-second-color"
          slot="start"
          [defaultHref]="redirectoTo(currentSection)"
          [text]="''">
        </ion-back-button>

        <ion-title
          class="text-second-color"
          slot="start">
          {{ currentSection?.label | translate }}
        </ion-title>

      </ion-toolbar>
    </ion-header>

   <!-- MENU LATERAL  -->
   <!-- <ion-menu side="start" menuId="first" contentId="main">
     <ion-header>
       <ion-toolbar >
         <ion-title class="text-color" >{{ 'COMMON.MENU' | translate}}</ion-title>
       </ion-toolbar>
     </ion-header>

     <ion-content >
       <ion-item class="text-second-color" *ngFor="let item of lateralMenu;  trackBy: trackById" [routerLink]="['/'+item?.link]" (click)="openEnd()">{{ item?.text | translate }}</ion-item>
     </ion-content >
   </ion-menu> -->

   <!-- RUTER  -->
   <ion-router-outlet id="main"></ion-router-outlet>

   <!-- TAB FOOTER  -->
    <!-- <ion-tabs *ngIf="currentSection$ | async as currentSection">
      <ion-tab-bar [translucent]="true" slot="bottom">
        <ion-tab-button
        *ngFor="let item of lateralMenu; trackBy: trackById"
          class="text-color-four"
          [ngClass]="{'active-class': [item?.link]?.includes(currentSection?.route)}" [routerLink]="[item?.link]">
          <ion-icon [name]="item?.icon"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs> -->

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

      if(url?.includes('/set/')) return {label:setName?.replace(/%20/g,' '), route:'set'};

      return {
        '/home':{label:'COMMON.TITLE', route:'home'},
        '/cards':{label:'COMMON.CARDS', route:'cards'},
        '/sets': {label:'COMMON.SETS', route:'sets'},
        // '/set': {label:'COMMON.SET', route:'set'},
        '/storage':{label:'COMMON.SAVED_CARDS', route:'storage'},
        '/banlist':{label:'COMMON.BANLIST', route:'banlist'},
      }[url] || {llabel:'COMMON.TITLE', route:'home'}
    })
    // ,tap(d => console.log(d))
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
