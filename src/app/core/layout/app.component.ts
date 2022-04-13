import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { trackById } from '@ygopro/shared/utils/helpers/functions';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template:`
  <ion-app >
    <!-- HEADER  -->
    <ion-header class="ion-no-border height-60">
      <ion-toolbar *ngIf="(currentSection$ | async) as currentSection">

        <ion-button *ngIf="navItems?.includes(currentSection)" fill="clear" size="small" slot="start"  (click)="open()">
          <ion-menu-button class="text-color"></ion-menu-button>
        </ion-button>

        <ion-back-button *ngIf="!navItems?.includes(currentSection)" class="text-color" slot="start" defaultHref="/home" [text]="''"></ion-back-button>

        <ion-title class="text-color" >{{ currentSection | translate }}</ion-title>
        <div size="small" slot="end" class="div-clear"></div>
      </ion-toolbar>
    </ion-header>

   <!-- MENU LATERAL  -->
   <ion-menu side="start" menuId="first" contentId="main">
     <ion-header>
       <ion-toolbar >
         <ion-title class="text-color" >{{ 'COMMON.MENU' | translate}}</ion-title>
       </ion-toolbar>
     </ion-header>

     <ion-content >
       <ion-item class="text-second-color" *ngFor="let item of lateralMenu;  trackBy: trackById" [routerLink]="['/'+item?.link]" (click)="openEnd()">{{ item?.text | translate }}</ion-item>
     </ion-content >
   </ion-menu>

   <!-- RUTER  -->
   <ion-router-outlet id="main"></ion-router-outlet>

 </ion-app>
 `,
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  trackById = trackById;
  lateralMenu:{id:number, link:string, text:string}[] = [
    { id:1, link:'home', text:'COMMON.SETS',  },
    { id:2, link:'search', text:'COMMON.SEARCH_PAGE' },
    { id:3, link:'banlist', text:'COMMON.BANLIST' },
    { id:4, link:'storage', text:'COMMON.SAVED_CARDS'}
  ];
  navItems = ['COMMON.BANLIST','COMMON.SAVED_CARDS','COMMON.SETS','COMMON.SEARCH_PAGE'];

  currentSection$: Observable<string> = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationStart),
    map((event: NavigationEnd) => {
      const { url = ''} = event || {};
      const setName =  (url?.split('/') || [])[2];
      if(url === '/banlist') return 'COMMON.BANLIST';
      if(url === '/storage') return 'COMMON.SAVED_CARDS';
      if(url === '/home') return 'COMMON.SETS';
      if(url === '/search') return 'COMMON.SEARCH_PAGE';
      if(url?.includes('/set/')) return setName?.replace(/%20/g,' ');
      return 'COMMON.SETS';
    })
  );


  constructor(
    private menu: MenuController,
    private router: Router
  ) {}


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
