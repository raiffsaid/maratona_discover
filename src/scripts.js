const Modal = {
    toggle() {
        document.querySelector('.modal-overlay').classList.toggle('active');
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
    },

    set(transactions) {
        localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions));
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);

        App.reload();
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        });

        return income;
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        });

        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = 
        `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html;
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = '';
    }
}

const Utils = {
    formatDate(date) {
        const splittedDate = date.split('-');

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100;
        
        return value;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return signal + value;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatData() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();

        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos!');
        }
    },

    clearFields() {
        Form.description.value = '';
        Form.amount.value = '';
        Form.date.value = '';
    },

    submit(event) {
        event.preventDefault(); //Interrompe o comportamento padrão do formulário

        try {
            Form.validateFields();
            const transaction = Form.formatData();
            Transaction.add(transaction);
            Form.clearFields();
            Modal.toggle();
        } catch (error) {
            alert(error.message);
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction);
        DOM.updateBalance();
        Storage.set(Transaction.all);
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();


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