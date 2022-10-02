import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, CardSet } from '@ygopro/shared/models';
import { BANNED, cardColor, errorImage, getObjectKeys, isNotEmptyObject, LIMIT, SEMI_LIMIT, trackById } from '@ygopro/shared/utils/functions';

@Component({
  selector: 'ygopro-card-component',
  template:`
  <ion-card class="ion-activatable ripple-parent card-card displays-around"
    [ngStyle]="{'background':cardColor(card)}"
    (click)="openSingleCardModal.next(card)"
    >
    <div class="card-title displays-around text-color">
      <div class="card-title-div span-bold">{{ card?.name }}</div>
      <div class="card-title-icon" (click)="presentPopover($event, card)">
        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
      </div>
    </div>

    <div class="card-item displays-around" >
      <div>
        <ng-container *ngIf="['set']?.includes(from)">
          <ng-container *ngIf="getCardInfo(card?.card_sets) as selectedSetCard">
            <ion-chip *ngIf="selectedSetCard?.set_code as set_code">
              <ion-label class="text-color">{{ set_code }}</ion-label>
            </ion-chip>
            <ion-chip *ngIf="selectedSetCard?.set_rarity as set_rarity">
              <ion-label class="text-color">{{ set_rarity }}
                <!-- <ng-container *ngIf="selectedSetCard?.set_rarity_code as set_rarity_code">{{ set_rarity_code}}</ng-container> -->
              </ion-label>
            </ion-chip>
            <ion-chip *ngIf="selectedSetCard?.set_price as set_price">
              <ion-label class="text-color-four span-bold">{{ set_price }} $</ion-label>
            </ion-chip>
          </ng-container>
        </ng-container>

        <ng-container *ngIf="['card', 'storage']?.includes(from)">
          <ion-chip *ngIf="card?.atk as atk" class="text-color">
            <ion-label class="text-color">{{ 'COMMON.ATK' | translate }} / {{ atk }}</ion-label>
          </ion-chip>
          <ion-chip *ngIf="card?.def as def" class="text-color">
            <ion-label class="text-color">{{ 'COMMON.DEF' | translate }} / {{ def }}</ion-label>
          </ion-chip>
          <ion-chip *ngIf="card?.race as race" class="text-color">
            <ion-label class="text-color">{{ 'COMMON.RACE' | translate }} / {{ race }}</ion-label>
          </ion-chip>
        </ng-container>

        <ng-container *ngIf="['banlist']?.includes(from)">
          <div *ngIf="card?.banlist_info?.[(banlistType === 'tcg' ? 'ban_tcg' : 'ban_ocg')] as banlist" class="span-bold displays-around margin-bottom-5">
            <span
              [ngClass]="{'forbidden': banlist === 'Banned', 'limited': banlist === 'Limited', 'semi-limited': banlist === 'Semi-Limited'}">
              {{ ( banlistType === 'tcg' ? 'COMMON.TCG' : banlistType === 'ocg' ? 'COMMON.OCG' : 'COMMON.GOAT') | translate}}:
            </span>
            <img [src]="(banlist === 'Banned'
                        ? BANNED
                        : banlist === 'Limited'
                        ? LIMIT
                        : banlist === 'Semi-Limited'
                        ? SEMI_LIMIT
                        : SEMI_LIMIT)"
            />
          </div>
        </ng-container>
      </div>

      <div >
        <ion-img loading="lazy" [src]="cardImage" [alt]="card?.name" (ionError)="errorImage($event)"></ion-img>
      </div>

      <ng-container *ngIf="isNotEmptyObject(card?.banlist_info) && !['banlist']?.includes(from)">
        <div class="banlist-div">
          <ng-container *ngFor="let banlistKey of getObjectKeys(card?.banlist_info); trackBy: trackById">
            <div *ngIf="card?.banlist_info?.[banlistKey] as banlist" class="card-result span-bold displays-center">
              <span
                class="font-size-9"
                [ngClass]="{'forbidden': banlist === 'Banned', 'limited': banlist === 'Limited', 'semi-limited': banlist === 'Semi-Limited'}">
                {{ ( banlistKey === 'ban_ocg' ? 'COMMON.OCG' : banlistKey === 'ban_tcg' ? 'COMMON.TCG' : 'COMMON.GOAT') | translate}}:
              </span>
              <img [src]="(banlist === 'Banned'
                          ? BANNED
                          : banlist === 'Limited'
                          ? LIMIT
                          : banlist === 'Semi-Limited'
                          ? SEMI_LIMIT
                          : SEMI_LIMIT)"
              />
            </div>
          </ng-container>
        </div>
      </ng-container>

    </div>

    <!-- RIPLE EFFECT  -->
    <ion-ripple-effect></ion-ripple-effect>
  </ion-card>
  `,
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  LIMIT = LIMIT;
  BANNED = BANNED;
  SEMI_LIMIT = SEMI_LIMIT;
  cardColor = cardColor;
  trackById = trackById;
  errorImage = errorImage;
  getObjectKeys = getObjectKeys;
  isNotEmptyObject = isNotEmptyObject
  @Input() card: Card;
  @Input() from: string;
  @Input() isSetName: string;
  @Input() banlistType: string;
  @Output() openSingleCardModal = new EventEmitter<Card>();
  @Output() presentPopoverTrigger = new EventEmitter<{event, info}>();


  constructor() { }


  get cardImage(): string {
    const [ image = null ]  = this.card?.card_images
    return image?.image_url_small || '';
  }

  presentPopover(event, info): void{
    event.stopPropagation();
    this.presentPopoverTrigger.next({event, info});
  }

  getCardInfo(cardSets: CardSet[] ): CardSet {
    return (cardSets || [])?.find(({set_name}) => set_name === this.isSetName) || cardSets?.[0];
  }


}
