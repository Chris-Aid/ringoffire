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
  @ViewChild('infoCard') infoCard: ElementRef;

  avatarValue = 2;
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  x = 1;
  cardImage: any;
  clockwise = false;
  infoCardDescription: string;
  infoCardTitle: string = 'Add players!'
  error = false;

  translateX = 100;

  backgroundImages = [
    { value: '1', title: 'Dark Board', image: 'assets/img/backgrounds/wood-1.jpg' },
    { value: '2', title: 'Bright Board', image: 'assets/img/backgrounds/wood-2.jpg' },
    { value: '3', title: 'Textured Wood', image: 'assets/img/backgrounds/wood-3.jpg' },
    { value: '4', title: 'Textured Wood dark', image: 'assets/img/backgrounds/wood-4.jpg' },
  ]

  cardCovers = [
    { value: '1', title: 'Blue card', image: 'assets/img/cards/card-cover1.jpg' },
    { value: '2', title: 'Purple card', image: 'assets/img/cards/card-cover2.png' },
  ]

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    var i = 1;
    let rotateInt = setInterval(() => {
      if (i == 51) {
      } else if (!this.clockwise) {
        if (i > 16) { this.clockwise = true; }
        this.topCard.nativeElement.style.transform = 'rotate(' + i * 10 + 'deg) translateX(' + this.translateX + 'px)';
        i++;
      } else {
        this.topCard.nativeElement.style.transform = 'rotate(' + i * -10 + 'deg) translateX(' + this.translateX + 'px)';
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
    this.checkScreenSize();
  }

  checkScreenSize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (w > 325 && w < 450) {
      this.translateX = 120;
    } else if (w >= 450 && w < 768) {
      this.translateX = 160;
    } else if (w >= 768 && w < 992) {
      this.translateX = 190;
    } else if (w >= 992 && w < 1200) {
      this.translateX = 220;
    } else if (w >= 1200 && w < 1400) {
      this.translateX = 250;
    } else if (w >= 1400) {
      this.translateX = 270;
    }
  }

  newGame() {
    this.game = new Game;
  }

  takeCard(imgElement, i) {
    if (this.game.players.length > 1) {
      if (!this.pickCardAnimation) {

        // console.log(this.avatarValue);
        this.pickCardAnimation = true;
        this.currentCard = this.game.stack.pop();

        this.nextPlayer();
        this.turnCardAnimation(imgElement, i);

        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 600);
      }
    } else {
      this.infoCardDescription = 'Please add at least two players bofore you pick a card!'
      this.infoCard.nativeElement.style.display = 'none';
    }
  }

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
    document.documentElement.style.setProperty('rotation', angle + "deg");
  }

  randomRotation(i) {
    return { 'transform': 'rotate(' + this.game.randomNumber[i] * 15 + 'deg)' }
  }

  addStyleToCards(i) {
    return { 'transform': 'rotate(' + i * 10 + 'deg)  translateX(' + this.translateX + 'px)' }
  }

  changeBackground(value) {
    this.x = value;
  }

  changeCardCover(value) {
    if (value == 1) {
      this.game.cardCoverImage = 'assets/img/cards/card-cover1.jpg';
    } else {
      this.game.cardCoverImage = 'assets/img/cards/card-cover2.png';
    }
    console.log(this.game.cardCoverImage)
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe(({ name, avatarValue }) => {
      if (name && name.length > 0 && this.game.players.length < 4) {
        this.game.players.push(name);
        this.game.avatars.push(avatarValue);
        if (this.game.players.length > 1) {
          this.infoCardDescription = 'Have fun! :)'
          this.infoCardTitle = 'Pick a card';
        }
      } else if (this.game.players.length > 3) {
        this.infoCardDescription = 'No more players available!'
        this.infoCardTitle = 'Sorry!';
      }
    });
  }
}