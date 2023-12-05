export default class Price {
  constructor(cents) {
    this.cents = cents;
  }
  display() {
    return (this.cents / 100).toFixed(2)
  }
}