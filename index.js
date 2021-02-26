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

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, current) => acc + current, 0);
  // Update UI
  labelBalance.textContent = `${acc.balance}\$`;
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

const updateUI = account => {
  displayMovments(account.movements); // Display movements
  calcDisplayBalance(account); // Display balance
  calcDisplaySummary(account); // Display summary
};

// Event Handler: - Login
let currentAccount;
btnLogin.addEventListener("click", function(event) {
  event.preventDefault();
  // find the user that matches the input
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // Check if account actually exists using the optional chaining (?)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // lose focus

    updateUI(currentAccount);

    console.log(currentAccount);
  }
});

// Transfer amounts from an account to another
btnTransfer.addEventListener("click", function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // find() method returns the first element that passes a test
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

// Close an account
btnClose.addEventListener("click", function(e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // Loop throgh accounts array and find the user
    // The findIndex() method returns the index of the first element in an array that pass a test
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

// Request a loan
btnLoan.addEventListener("click", function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  // Accept loans only if any deposit >= 10% of the request
  // for example: I can request 10,000 if I have at least 1000 as a deposit
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  }
});

// const max = Math.max(...account1.movements);
// console.log(max);

// includes - some - every
console.log(account1.movements.includes(-130));
// The some() method checks if any of the elements in an array pass a test
console.log(account1.movements.some(mov => mov > 1000));
// The every() method checks if all elements in an array pass a test
console.log(account1.movements.every(mov => mov > 0));

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"]
]);

/////////////////////////////////////////////////
