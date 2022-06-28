import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @ViewChild('cardsOnTable') ElementView: ElementRef;
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  x = 1;
  

  backgroundImages = [
    {value: '1', title: 'Dark Board', image: '/assets/img/backgrounds/wood-1.jpg'},
    {value: '2', title: 'Bright Board', image: '/assets/img/backgrounds/wood-2.jpg'},
    {value: '3', title: 'Textured Wood', image: '/assets/img/backgrounds/wood-3.jpg'},
    {value: '4', title: 'Textured Wood dark', image: '/assets/img/backgrounds/wood-4.jpg'},
  ]

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.startDealing();
    this.newGame();
  }

  newGame() {
    this.game = new Game;
  }

  takeCard(imgElement) {
    // if (this.game.players.length > 1) {
      if (!this.pickCardAnimation) {

        this.pickCardAnimation = true;
        this.currentCard = this.game.stack.pop();

        this.nextPlayer();
        this.turnCardAnimation(imgElement);
  
        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 1000);
      }
    // } else {
    //   console.log('false')
    // }
  }

  nextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

  startDealing() {
      setInterval(() => {
        // let i = 0;
        if (this.game.dealingCards.length > 0) {
          let poppedCard = this.game.dealingCards.pop();
          this.game.dealedCards.push({ source: poppedCard});
          // i++;
        }
      }, 100);
  }

  turnCardAnimation(imgElement) {

    imgElement.style.transform = 'translateY(0px) translateX(0px) rotate(0deg)';
    imgElement.classList.add('turnCardAnimation');
    setTimeout(() => {
      imgElement.remove();
    }, 1000);


  }

  addStyleToCards(i) {
    return {'transform': 'rotate('+ i * 10 +'deg)  translateX('+ 250 +'px)' }
  }

  styleTopCard(i) {
    // return {'transform': 'rotate('+ i * 10 +'deg)  translateX('+ 250 +'px)' }
    return { 'transform': 'rotate(0deg) translateX(250px)'};
  }

  changeBackground(value) {
    this.x = value;
  }
}