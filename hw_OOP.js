//PARENT
function Position(item) {
  this.price = item.price;
  this.calorie = item.calorie;
  this.type = item.type;
}

Position.prototype = {
  calculatePrice: function () {
    return this.price;
  },
  calculateCalories: function () {
    return this.calorie;
  },
  getType: function () {
    return this.type;
  },
};

//CHILDS
function Drink(drink) {
  Position.call(this, drink);
}

Drink.prototype = Object.create(Position.prototype);
Drink.COLA = { price: 50, calorie: 40, type: "Cola" };
Drink.COFFEE = { price: 80, calorie: 20, type: "Coffee" };

function Salad(salad, weight = 100) {
  const temp = {
    price: weight === 100 ? salad.price : (salad.price * weight) / 100,
    calorie: weight === 100 ? salad.calorie : (salad.calorie * weight) / 100,
    type: salad.type,
  };
  Position.call(this, temp);
  this.weight = weight;
}

Salad.CAESAR = { price: 100, calorie: 20, type: "Caesar" };
Salad.OLIVIE = { price: 50, calorie: 80, type: "Olivie" };
Salad.prototype = Object.create(Position.prototype);

function HamburgerSize(size) {
  Position.call(this, size);
}
HamburgerSize.prototype = Object.create(Position.prototype);

function HamburgerStuffing(stuffing) {
  Position.call(this, stuffing);
}
HamburgerStuffing.prototype = Object.create(Position.prototype);

function Hamburger(size, stuffing) {
  this.size = new HamburgerSize(size);
  this.stuffing = new HamburgerStuffing(stuffing);
  const temp = {
    price: this.size.calculatePrice() + this.stuffing.calculatePrice(),
    calorie: this.size.calculateCalories() + this.stuffing.calculateCalories(),
    type: this.size.getType().concat(" ", this.stuffing.getType()),
  };
  Position.call(this, temp);
}

Hamburger.prototype = Object.create(Position.prototype);
Hamburger.prototype.getSize = function () {
  return Position.prototype.getType.call(this.size);
};
Hamburger.prototype.getStuffing = function () {
  return Position.prototype.getType.call(this.stuffing);
};

Hamburger.SIZE_SMALL = { price: 50, calorie: 20, type: "Small" };
Hamburger.SIZE_LARGE = { price: 100, calorie: 40, type: "Large" };
Hamburger.STUFFING_CHEESE = { price: 10, calorie: 20, type: "Cheese" };
Hamburger.STUFFING_SALAD = { price: 20, calorie: 5, type: "Salad" };
Hamburger.STUFFING_POTATO = { price: 15, calorie: 10, type: "Potato" };

//ORDER
function Order() {
  this.paid = false;
  this.items = [];
}

Order.prototype = {
  constructor: Order,
  addItem: function (item, amount = 1) {
    if (!this.paid) {
      while (amount > 0) {
        this.items.push(item);
        amount--;
      }
      return "Order updated";
    }
    return "Order is already paid";
  },
  removeItem: function (item) {
    if (!this.paid) {
      let index = this.items.indexOf(item);
      if (index < 0) {
        return `Item wasn't in order`;
      }
      this.items.splice(index, 1);
      return `Item has been removed from order`;
    }
    return "Order is already paid. No changes allowed";
  },
  pay: function () {
    this.paid = true;
    return "Order is paid";
  },
  calculatePrice: function () {
    return `Total price: ${this.items.reduce(
      (sums, el) => sums + el.calculatePrice(),
      0
    )}`;
  },
  calculateCalories: function () {
    return `Total calories: ${this.items.reduce(
      (sums, el) => sums + el.calculateCalories(),
      0
    )}`;
  },
};

//TEST
const hamburgerLargePotato = new Hamburger(
  Hamburger.SIZE_LARGE,
  Hamburger.STUFFING_POTATO
); //{ price:115, calorie: 50, type: "Large"/"Potato" };
const saladOlivie = new Salad(Salad.OLIVIE, 50); //{ price:25, calorie: 40, type: "Olivie" };
const drinkCola = new Drink(Drink.COLA); //{ price:50, calorie: 40, type: "Cola" };
const order = new Order();

order.addItem(hamburgerLargePotato, 2);
order.addItem(drinkCola, 0);
order.addItem(saladOlivie);
console.log(
  hamburgerLargePotato.calculatePrice(),
  drinkCola.calculatePrice(),
  saladOlivie.calculatePrice()
); //115 50 25
console.log(order.removeItem(drinkCola)); //Item wasn't in order
order.addItem(drinkCola); //drinkCola*1
order.addItem(drinkCola); //drinkCola*2
console.log(order.removeItem(drinkCola)); //Item has been removed from order
console.log(order.calculatePrice()); //hamburgerLargePotato(115)*2+drinkCola(50)+saladOlivie(25)=305
console.log(order.pay()); //Order is paid
console.log(order.removeItem(drinkCola)); //Order is already paid. No changes allowed
console.log(order.calculateCalories()); //hamburgerLargePotato(50)*2+drinkCola(40)+saladOlivie(40)=180
