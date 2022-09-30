import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  template:`
    <div class="error-serve" [ngStyle]="{'margin-top': top}">
      <div>
        <span>
          <img [src]="image"/>
        </span>
        <br>
        <span class="text-color">{{title | translate}}</span>
      </div>
    </div>
  `,
  styleUrls: ['./no-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataComponent {

  @Input() top = '40vh';
  @Input() title: string;
  @Input() image: string;


  constructor() { }


}
