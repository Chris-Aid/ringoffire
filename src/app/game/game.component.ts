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
  @ViewChild('addPlayerBtn') addPlayerBtn: ElementRef;

  readonly HalfCircleDealed = 17;

  pickCardAnimation = false;
  errorInfo = false;
  jump = false;

  avatarValue = 2;
  translateX = 100;
  currentBackgroundImage = 1;

  currentCard: string = '';
  infoCardDescription: string;
  infoCardTitle: string = 'Add players!'
  game: Game;
  cardImage: any;

  backgroundImages = [
    { value: '1', title: 'Dark Board', image: 'assets/img/backgrounds/wood-1.jpg' },
    { value: '2', title: 'Bright Board', image: 'assets/img/backgrounds/wood-2.jpg' },
    { value: '3', title: 'Textured Wood', image: 'assets/img/backgrounds/wood-3.jpg' },
    { value: '4', title: 'Textured Wood dark', image: 'assets/img/backgrounds/wood-4.jpg' },
  ];

  cardCovers = [
    { value: '1', title: 'Blue card', image: 'assets/img/cards/card-cover1.jpg' },
    { value: '2', title: 'Purple card', image: 'assets/img/cards/card-cover2.png' },
  ];

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.topcardDealingAnimation();
  }

  topcardDealingAnimation() {
    var i = 0;
    let clockwise = false;

    // this Interval deals the cards and turn each card clockwise until the half circle of cards is dealed 
    // then it changes the rotation counterclockwise to make the animation look better!
    let dealTheCards = setInterval(() => {
      if (!clockwise) {
        this.topCard.nativeElement.style.transform = 'rotate(' + i * 10 + 'deg) translateX(' + this.translateX + 'px)';
        i++;
        if (i > this.HalfCircleDealed) { clockwise = true; }
      } else {
        this.topCard.nativeElement.style.transform = 'rotate(' + i * -10 + 'deg) translateX(' + this.translateX + 'px)';
        i--;
        // if all cards are dealed, topcard is hidden and interval stops!
        if (this.game.dealingCards.length <= 0) {
          this.topCard.nativeElement.style.display = 'none';
          clearInterval(dealTheCards);
        }
      }
    }, 250);
  }

  ngOnInit(): void {
    this.startDealing();
    this.newGame();
    this.onResize();
  }

  //this function changes the gap between the dealed cards every time the screen resizes
  onResize() {
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
    } else if (w >= 1200 && w < 1400 && h > 800) {
      this.translateX = 230;
    } else if (w >= 1400 && h > 800) {
      this.translateX = 270;
    } else if (w >= 1200 && h < 800) {
      this.translateX = 210;
    }
  }

  newGame() {
    this.game = new Game;
  }

  takeCard(imgElement, i) {
    if (this.game.players.length > 1) {
      if (!this.pickCardAnimation) {
        
        this.currentCard = this.game.stack.pop();
        this.turnCardAnimation(imgElement, i);
        this.pickCardAnimation = true;
        this.nextPlayer();

        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 600);
      }
    } else {
      this.pickMorePlayers();
    }
  }
 
  // current player variable changes color of current player to orange
  nextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }

  // adds animation to info card and add-player-button
  pickMorePlayers() {
    this.infoCardDescription = 'Please add at least two players bofore you pick a card!'
    this.jump = true;
    this.errorInfo = true;
    setTimeout(() => {
      this.jump = false;
      this.errorInfo = false
    }, 1200);
  }

  startDealing() {
    setInterval(() => {
      if (this.game.dealingCards.length > 0) {
        let lastCardOfStack = this.game.dealingCards.pop();
        this.game.dealedCards.push({ source: lastCardOfStack });
      }
    }, 250);
  }

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

    // a, c and d are not used in this case
    var a = myValue[0]; // 0.866025
    var b = myValue[1]; // 0.5
    var c = myValue[2]; // -0.5
    var d = myValue[3]; // 0.866025

    // put variable 'b' to Math.asin function to get rotation
    var angle = Math.round(Math.asin(b) * (180 / Math.PI));
    document.documentElement.style.setProperty('rotation', angle + "deg");
  }

  // adds a random rotation to cards that are taken
  randomRotation(i) {
    return { 'transform': 'rotate(' + this.game.randomNumber[i] * 15 + 'deg)' }
  }

  addStyleToCards(i) {
    return { 'transform': 'rotate(' + i * 10 + 'deg)  translateX(' + this.translateX + 'px)' }
  }

  changeBackground(value) {
    this.currentBackgroundImage = value;
  }

  // dialog of adding players
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

  refresh() {
    window.location.reload();
  }

    //this function is not in use right now!
  // changeCardCover(value) {
  //   if (value == 1) {
  //     this.game.cardCoverImage = 'assets/img/cards/card-cover1.jpg';
  //   } else {
  //     this.game.cardCoverImage = 'assets/img/cards/card-cover2.png';
  //   }
  // }
}