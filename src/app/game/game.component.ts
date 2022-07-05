import { Component, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})


export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('cardsOnTable') ElementView: ElementRef;
  @ViewChild('topCard') topCard: ElementRef;
  @ViewChild('playedCard') playedCard: ElementRef;

  @Input() avatarValue: any;

  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  x = 1;
  clockwise = false;
  addPlayers = 'hello'

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
    console.log(this.avatarValue);
  }

  newGame() {
    this.game = new Game;
  }

  takeCard(imgElement, i) {
    if (this.game.players.length > 1) {
      if (!this.pickCardAnimation) {

        console.log(this.game);
        this.pickCardAnimation = true;
        this.currentCard = this.game.stack.pop();

        this.nextPlayer();
        this.turnCardAnimation(imgElement, i);

        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
          // this.playedCard.classList.add('played-cards');
        }, 600);
      }
    } else {
      this.addPlayers = 'Please add at least two players bofore you pick a card!'
    }
  }

  // safeValue(value) {
  //   this.avatarValue = value;
  //   console.log(this.avatarValue)
  // }

  nextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }

  startDealing() {
    setInterval(() => {
      if (this.game.dealingCards.length > 0) {
        let poppedCard = this.game.dealingCards.pop();
        this.game.dealedCards.push({ source: poppedCard });
      }
    }, 250);
  }


  newItem = [];

  turnCardAnimation(imgElement, i) {

    let style = getComputedStyle(imgElement);
    let CardMatrix = style.transform;

    this.getRotationOfMatrix(CardMatrix, i);

    imgElement.classList.add('turnCardAnimation');

    setTimeout(() => {
      imgElement.remove();
    }, 600);

  }

  getRotationOfMatrix(CardMatrix, i) {
    var values = CardMatrix.split('(')[1],
      firstValues = values.split(')')[0],
      myValue = firstValues.split(',');

    //matrix just contains sin and cos - only var v is used for generating rotation

    var a = myValue[0]; // 0.866025
    var b = myValue[1]; // 0.5
    var c = myValue[2]; // -0.5
    var d = myValue[3]; // 0.866025

    // put variable 'b' to Math.asin function
    var angle = Math.round(Math.asin(b) * (180 / Math.PI));
    console.log(angle);

    document.documentElement.style.setProperty('rotation', angle + "deg");
  }

  randomRotation(i) {
    return { 'transform': 'rotate(' + this.game.randomNumber[i] * 15 + 'deg)' }
  }

  addStyleToCards(i) {
    return { 'transform': 'rotate(' + i * 10 + 'deg)  translateX(' + 250 + 'px)' }
  }

  changeBackground(value) {
    this.x = value;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}

// export class GameInfoComponent {

//   title = 'hello';
// }