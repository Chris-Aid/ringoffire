export class Game {
  public players: string[] = [];
  public stack: string[] = [];
  public playedCards: string[] = [];
  public randomNumber: number[] = [];
  public currentPlayer: number = 0;

  public dealingCards: string[] = [];
  public dealedCards = [];

  constructor() {
    for (let i = 1; i < 14; i++) {
      this.stack.push('hearts_' + i)
      this.stack.push('spades_' + i)
      this.stack.push('clubs_' + i)
      this.stack.push('diamonds_' + i)
    }

    for (let i = 0; i < 52; i++) {
      this.dealingCards.push('/assets/img/cards/card-cover.jpg');
    }

    for (let i = 0; i < 52; i++) {
      this.randomNumber.push(Math.random());
    }

    shuffle(this.stack);
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

  // Used like so
//   var arr = [2, 11, 37, 42];
//   shuffle(arr);
//   console.log(arr);