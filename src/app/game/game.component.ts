import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  errorInfo = false;
  jump = false;

  dealingSpeed = 250;
  avatarValue = 2;
  translateX = 100;
  currentBackgroundImage = 1;
  alreadyPlayed: boolean = false;
  gameStarted: true;

  infoCardDescription: string = "";
  infoCardTitle: string = ''
  game: Game;
  myGameId: string;
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
  db: any;

  constructor(public dialog: MatDialog, private firestore: AngularFirestore, private route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.topcardDealingAnimation();
    this.startDealing(250);
  }

  topcardDealingAnimation() {
    var i = 0;
    let clockwise = false;

    // this Interval deals the cards and turn each card clockwise until the half circle of cards is dealed 
    // then it changes the rotation counterclockwise to make the animation look better!

    let dealTheCards = setInterval(() => {
      if (this.topCard && this.game.dealingCards.length > 0) {
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
      }
    }, 250);
  }

  ngOnInit() {
    this.newGame();
    this.onResize();
    this.setInfobox();
    this.getGameFromFirestore();
  }

  newGame() {
    this.game = new Game();
  }

  getGameFromFirestore() {
    this.route.params.subscribe((params) => {
      console.log(params['id'])
      this.myGameId = params['id'];

      this.firestore
        .collection('games')
        .doc(this.myGameId)
        .valueChanges()
        .subscribe((game: any) => {
          this.game.currentPlayer = game.currentPlayer
          this.game.playedCards = game.playedCards
          this.game.stack = game.stack
          this.game.players = game.players
          this.game.avatars = game.avatars
          this.game.pickCardAnimation = game.pickCardAnimation
          this.game.currentCard = game.currentCard
          this.game.dealedCards = game.dealedCards
          this.game.dealingCards = game.dealingCards
          if (game.title && game.description) {
            this.infoCardTitle = game.title
            this.infoCardDescription = game.description
          }
        });
    });
  }

  setInfobox() {
    if (this.game.players.length > 1) {
      this.infoCardTitle = 'Pick a card! :)'
      this.infoCardDescription = 'Have fun!'
    } else {
      this.infoCardTitle = 'Add players!'
      this.infoCardDescription = 'Please add at least two players bofore you pick a card!'
    }
    this.updateInfobox();
  }

  takeCard(imgElement, i) {
    if (this.game.players.length > 1) {
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop();
        this.turnCardAnimation(imgElement, i);
        this.game.pickCardAnimation = true;
        this.nextPlayer();

        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.game.dealedCards[i].alreadyPlayed = true;
          this.saveGame();
        }, 600);
      }
    } else {
      this.pickMorePlayers();
    }
  }

  startDealing(dealingSpeed) {
    if (this.game.dealingCards.length > 0) {
      let popCard = setInterval(() => {
        if (this.game.dealingCards.length > 0) {
          let lastCardOfStack = this.game.dealingCards.pop();
          this.game.dealedCards.push({ source: lastCardOfStack });
        } else {
          clearInterval(popCard)
          this.saveGame();
        }
      }, dealingSpeed);
    }
  }

  turnCardAnimation(imgElement, i) {

    let addAnimation = document.getElementById('card_' + i)
    addAnimation.classList.add('turnCardAnimation');
    this.game.dealedCards[i].cardTurned = true;

    let style = getComputedStyle(imgElement);
    let CardMatrix = style.transform;
    this.getRotationOfMatrix(CardMatrix, i);
    // this.saveGame();

    setTimeout(() => {
      // this.game.dealedCards.splice(i, 1);
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
      this.updateInfobox();
      this.saveGame();
    });
  }

  updateInfobox() {
    this.firestore
      .collection('games')
      .doc(this.myGameId)
      .update({ description: this.infoCardDescription, title: this.infoCardTitle });
  }

  //starts a new game!!
  replay() {
    this.game.startNewGame();
    this.infoCardTitle = 'Pick a card! :)'
    this.infoCardDescription = "";
    this.game.currentCard = "";
    this.updateInfobox();
    this.saveGame();
    location.reload();
  }

  saveGame() {
    this.firestore
      .collection('games')
      .doc(this.myGameId)
      .update(this.game.toJson());
  }

  // checkIfCardPlayed() {
  //   for (var card of this.game.dealedCards) {
  //     if(card.alreadyPlayed) {
  //       console.log(card)
  //     }
  //   }
  //   // setInterval( () => {

  //   // },)
  // }

  // current player variable changes color of current player to orange
  nextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }

  // adds animation to info card and add-player-button
  pickMorePlayers() {
    this.infoCardTitle = 'Add players!'
    this.infoCardDescription = 'Please add at least two players bofore you pick a card!'
    this.jump = true;
    this.errorInfo = true;
    setTimeout(() => {
      this.jump = false;
      this.errorInfo = false
    }, 1200);
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

  skipDealing(dealingSpeed) {
    this.startDealing(dealingSpeed);
    this.topCard.nativeElement.style.display = 'none';
  }
}