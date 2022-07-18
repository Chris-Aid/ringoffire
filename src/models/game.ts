export class Game {
  public players: string[] = [];
  public avatarValue: string[] = [];
  public avatars = [];
  public stack: string[] = [];
  public playedCards: string[] = [];
  public randomNumber: number[] = [];
  public roationOfCards: number[] = [];
  public currentPlayer = 0;

  public dealingCards: string[] = [];
  public dealedCards = [];
  public pickCardAnimation = false;
  public currentCard: string = '';

  restart = false;

  cardCoverImage = 'assets/img/cards/card-cover1.jpg';

  constructor() {
    this.startNewGame();
  }

  // public aNewGame() {

  // }

  public startNewGame() {
    this.stack = [];
    this.dealingCards = [];
    this.randomNumber = [];
    this.roationOfCards = [];
    this.playedCards = [];
    this.dealedCards = [];

    // pushes all 52 cards to the stack
    for (let i = 1; i < 14; i++) {
      this.stack.push('hearts_' + i)
      this.stack.push('spades_' + i)
      this.stack.push('clubs_' + i)
      this.stack.push('diamonds_' + i)
    }

    shuffle(this.stack);

    //pushes 52 card cover images to array
    for (let i = 0; i < 52; i++) {
      this.dealingCards.push(this.cardCoverImage);
    }

    //generates 52 random numbers with either - or + sign
    for (let i = 0; i < 52; i++) {
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      this.randomNumber.push(plusOrMinus * Math.random());
    }

    //generates random rotations
    for (let i = 0; i < 52; i++) {
      this.roationOfCards.push(i * 1);
    }
  }

  public toJson() {
    return {
      players: this.players,
      stack: this.stack,
      playedCards: this.playedCards,
      currentPlayer: this.currentPlayer,
      avatars: this.avatars,
      pickCardAnimation: this.pickCardAnimation,
      currentCard: this.currentCard,
      restart: this.restart,
      dealedCards: this.dealedCards
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