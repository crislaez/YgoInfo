import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { from, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Card } from '@ygopro/shared/shared/models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  readonly cards = 'ygoInfoCard';


  constructor() { }


  getCards(): Observable<any>{
    return from(this.localCards()).pipe(
      map(data => (data || []))
    )
  }

  deleteCard(idCard: number): Observable<any>{
    return from(this.localCards()).pipe(
      map(data => {
        let allCards = [...data] || [];
        const cardIndex = allCards?.findIndex(({id}) => id === idCard) || null

        if(cardIndex > -1) {
          allCards.splice(cardIndex,1)
          this.saveLocalCards(allCards)
          return {code:200}
        }
        else return {code:403}
      })
    )
  }

  saveCard(card: Card): Observable<any>{
    return from(this.localCards()).pipe(
      map(data => {
      let allCards = [...data] || [];

      let checkQuantity = (allCards || [])?.filter(({id}) => id === card?.id);
      checkQuantity = [...checkQuantity, card];

      if(checkQuantity?.length > 3){
        return {code:403}
      }

      allCards.push(card)
      this.saveLocalCards(allCards)
      return {code:200}
      })
    )
  }


  async localCards(){
    const cards = await Storage.get({key: this.cards})
    return await JSON.parse(cards?.value) || []
  }

  async saveLocalCards(cards: Card[]){
    await Storage.set({key: this.cards, value: JSON.stringify(cards)})
  }


}
