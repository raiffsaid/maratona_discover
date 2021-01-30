const Modal = {
    toggle() {
        document.querySelector('.modal-overlay').classList.toggle('active');
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '29/01/2021',
    },
    {
        id: 2,
        description: 'Internet',
        amount: -20000,
        date: '29/01/2021',
    },
    {
        id: 3,
        description: 'Salário',
        amount: 500000,
        date: '29/01/2021',
    },
];

const Transaction = {
    incomes() {

    },
    expenses() {

    },
    total() {

    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction);

        DOM.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const html = 
        `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${transaction.amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt="Remover Transação"></td>
        `

        return html;
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

    }
}

transactions.forEach((transaction) => {
    DOM.addTransaction(transaction);
});

/**
 * Altera tema light / dark
 */
let checkbox = document.querySelector('input[name=theme]');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        transition();
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        transition();
        document.documentElement.setAttribute('data-theme', 'light');
    }
});

/**
 * Altera tema light / dark no mobile
 */
function changeMobileTheme() {
    // Salva o diretório atual
    let loc = window.location.href;
    let dir = loc.substring(0, loc.lastIndexOf('/'));

    if (document.getElementById("mobileTheme").src == dir + "/assets/moon.svg") {
        document.getElementById("mobileTheme").src = (dir + "/assets/sun.svg");
        transition();
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.getElementById("mobileTheme").src = (dir + "/assets/moon.svg");
        transition();
        document.documentElement.setAttribute('data-theme', 'dark');
  }
}

/**
 * Cria suavização na troca de tema
 */
function transition() {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
    }, 1000);
}