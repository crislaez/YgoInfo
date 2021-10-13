import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { from, Observable } from 'rxjs';
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
      tap(data => console.log(data)),
      map(data => data || [])
    )
  }

  // getCard(idNote: number): Observable<any>{
  //   return from(this.localCards()).pipe(
  //     map(data => {
  //       let allNotes = data || []
  //       const note = allNotes?.find(({id}) => id === idNote) || {}
  //       return note || null
  //     })
  //   )
  // }

  deleteCard(idCard: number): Observable<any>{
    return from(this.localCards()).pipe(
      map(data => {
        let allCards = data || []
        const cardIndex = allCards?.findIndex(({id}) => id === idCard) || null
        let copyObject = [...allCards]
        if(cardIndex > -1) {
          copyObject.splice(cardIndex,1)
          this.saveLocalCards(copyObject)
          return {message:'carta borrada'}
        }
        else return {message:'error al borrar la carta'}
      })
    )
  }

  createCard(card: Card): Observable<any>{
    return from(this.localCards()).pipe(
      map(data => {
      let allCards = data || [];
      card = {...card, id: (allCards[allCards?.length -1]?.id || 0) + 1}
      let copyObject = [...allCards]
      copyObject.push(card)
      this.saveLocalCards(copyObject)
      return {message:'carta agregada'}
      })
    )
  }


  async localCards(){
    const cards = await Storage.get({key: this.cards})
    return await JSON.parse(cards?.value)
  }

  async saveLocalCards(cards: Card[]){
    await Storage.set({key: this.cards, value: JSON.stringify(cards)})
  }


}
