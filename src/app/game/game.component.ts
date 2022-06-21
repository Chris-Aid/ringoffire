import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.startDealing();
    this.newGame();
  }

  newGame() {
    this.game = new Game;
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();

      console.log(this.game);
      this.pickCardAnimation = true;
      console.log(this.currentCard);

      // this.game.dealingCards.splice(-1);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
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
    // setTimeout(() => {
    setInterval(() => {
      if (this.game.dealingCards.length > 0) {
        let poppedCard = this.game.dealingCards.pop();
        this.game.dealedCards.push(poppedCard);
        console.log(poppedCard)
      } else {
        document.getElementById('topCard').style.display = "none";
        // this.designCardsAfterDealing();
      }
    }, 200);
    // }, 500);
  }

  randomMath() {
    if (this.game.dealedCards.length < 52) {
      return 30 * Math.random(); 
    } else {
      return 10;
    }
  }

  // designCardsAfterDealing() {
  //   document.getElementById('card_15').style.left = "32px";
  // }
}