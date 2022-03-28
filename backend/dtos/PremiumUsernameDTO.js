class PremiumUsernameDTO {
  constructor(model) {
    const { _id, username, price, discountPrice, available } = model;

    this.id = _id.toString();
    this.username = username;
    this.price = price;
    this.discountPrice = discountPrice;
    this.available = available;
  }
}

module.exports = PremiumUsernameDTO;
