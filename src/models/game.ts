export class Game {
  public players: string[] = [];
  public avatars = [];
  public stack: string[] = [];
  public playedCards: string[] = [];
  public randomNumber: number[] = [];
  public roationOfCards: number[] = [];
  public currentPlayer: number = 0;

  public dealingCards: string[] = [];
  public dealedCards = [];

  cardCoverImage = 'assets/img/cards/card-cover1.jpg';

  constructor() {

    this.stack = [];
    this.dealingCards = [];
    this.randomNumber = [];
    this.roationOfCards = [];

    for (let i = 1; i < 14; i++) {
      this.stack.push('hearts_' + i)
      this.stack.push('spades_' + i)
      this.stack.push('clubs_' + i)
      this.stack.push('diamonds_' + i)
    }

    shuffle(this.stack);

    for (let i = 0; i < 52; i++) {
      this.dealingCards.push(this.cardCoverImage);
    }

    for (let i = 0; i < 52; i++) {
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      this.randomNumber.push(plusOrMinus * Math.random());
    }

    for (let i = 0; i < 52; i++) {
      this.roationOfCards.push(i * 1);
    }

  }
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}