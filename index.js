"use strict";
// Import stylesheets
import "./style.css";

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Ahmad Saleh",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const createUsername = function(accounts) {
  accounts.forEach(account => {
    // Create new property 'username' for each
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map(word => word[0])
      .join("");
  });
};
createUsername(accounts);

const displayMovments = function(movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function(mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
        <div class="movements__value">${mov}\$</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function(movements) {
  const balance = movements.reduce((acc, current) => acc + current, 0);
  // Update UI
  labelBalance.textContent = `${balance}\$`;
};

// Note:  0 is the inital value - the 2nd parameter of reduce method
// array.reduce(function(acc, currentValue, currentIndex, arr), initialValue)

// filter - map - reduce
const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}﹩`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}﹩`;

  // interest (1.2): ex. 500 * 1.2 / 100 = 6
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1) // exclude intrests less than $1
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}﹩`;
};

// find() method returns the first element that passes a test
const account = accounts.find(acct => acct.owner === "Jessica Davis");
console.log(account);

// Event Handler:
// Login
let currentAccount;
btnLogin.addEventListener("click", function(event) {
  event.preventDefault();
  console.log("Login");
  // find the user that matches the input
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // Check if account actually exists using the (?)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("Login success!");
    console.log(currentAccount);
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // lose focus

    displayMovments(currentAccount.movements);
    calcDisplayBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount);
  }
});

// const max = Math.max(...account1.movements);
// console.log(max);

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"]
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);

/////////////////////////////////////////////////
