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
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('cardsOnTable') ElementView: ElementRef;
  @ViewChild('topCard') topCard: ElementRef;

  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  x = 1;
  clockwise = false;


  backgroundImages = [
    { value: '1', title: 'Dark Board', image: '/assets/img/backgrounds/wood-1.jpg' },
    { value: '2', title: 'Bright Board', image: '/assets/img/backgrounds/wood-2.jpg' },
    { value: '3', title: 'Textured Wood', image: '/assets/img/backgrounds/wood-3.jpg' },
    { value: '4', title: 'Textured Wood dark', image: '/assets/img/backgrounds/wood-4.jpg' },
  ]

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    var i = 1;
    let rotateInt = setInterval(() => {
      if (i == 51) {
      } else if (!this.clockwise) {
        if (i > 16) { this.clockwise = true; }
        this.topCard.nativeElement.style.transform = 'rotate(' + i * 10 + 'deg) translateX(250px)';
        i++;
      } else {
        this.topCard.nativeElement.style.transform = 'rotate(' + i * -10 + 'deg) translateX(250px)';
        i--;
        if (this.game.dealingCards.length <= 0) {
          clearInterval(rotateInt);
          this.topCard.nativeElement.style.display = 'none';
        }
      }
    }, 250)

  }


  ngOnInit(): void {
    this.startDealing();
    this.newGame();
  }

  newGame() {
    this.game = new Game;
  }

  takeCard(imgElement, i) {
    // if (this.game.players.length > 1) {
    if (!this.pickCardAnimation) {

      console.log(this.game);
      this.pickCardAnimation = true;
      this.currentCard = this.game.stack.pop();

      this.nextPlayer();
      this.turnCardAnimation(imgElement, i);

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 600);
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
      if (this.game.dealingCards.length > 0) {
        let poppedCard = this.game.dealingCards.pop();
        this.game.dealedCards.push({ source: poppedCard });
      }
    }, 250);
  }


  turnCardAnimation(imgElement, i) {

    let style = getComputedStyle(imgElement);
    let CardMatrix = style.transform;
    // imgElement.style.transform = style.transform;

    var values = CardMatrix.split('(')[1],
      firstValues = values.split(')')[0],
      myValue = firstValues.split(',');

    //matrix just contains sin and cos

    var a = myValue[0]; // 0.866025
    var b = myValue[1]; // 0.5
    var c = myValue[2]; // -0.5
    var d = myValue[3]; // 0.866025

    console.log(b)

    // put variable 'b' to Math.asin function
    var angle = Math.round(Math.asin(0.5) * (180 / Math.PI));
    console.log(angle);

    imgElement.style.setProperty('rotation', angle + "deg");
    imgElement.classList.add('turnCardAnimation');
    setTimeout(() => {
      imgElement.remove();
    }, 8000);


  }

  addStyleToCards(i) {
    return { 'transform': 'rotate(' + i * 10 + 'deg)  translateX(' + 250 + 'px)' }
  }

  changeBackground(value) {
    this.x = value;
  }
}