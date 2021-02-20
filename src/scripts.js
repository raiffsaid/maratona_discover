const Theme = {
    /**
     * Altera tema light / dark
     */
    themeSwitcher() {
        let checkbox = document.querySelector('input[name=theme]');
        
        let theme = Storage.themeStorage(); // Salva o tema atual na variável theme

        // Se o checkbox possuir o mesmo valor de theme, altera o input do checkbox
        checkbox.checked = theme == 'dark' ? true : false;

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                Theme.transition();
                document.documentElement.setAttribute('data-theme', 'dark');
                window.localStorage.setItem('data-theme', 'dark');
            } else {
                Theme.transition();
                document.documentElement.setAttribute('data-theme', 'light');
                window.localStorage.setItem('data-theme', 'light');
            }
        });
    },

    /**
     * Altera tema light / dark no mobile
     */
    mobileThemeSwitcher() {
        // Salva o diretório atual
        let loc = window.location.href;
        let dir = loc.substring(0, loc.lastIndexOf('/'));

        let img = document.getElementById("mobileTheme");

        let theme = Storage.themeStorage();

        // Verifica o tema no localStorage e muda a imagem
        theme == 'dark' ? img.src = (dir + "/assets/moon.svg") : img.src = (dir + "/assets/sun.svg");
            
        img.addEventListener('click', () => {
            if (theme == 'dark') {
                img.src = (dir + "/assets/sun.svg");
                Theme.transition();
                document.documentElement.setAttribute('data-theme', 'light');
                window.localStorage.setItem('data-theme', 'light');
            } else {
                img.src = (dir + "/assets/moon.svg");
                Theme.transition();
                document.documentElement.setAttribute('data-theme', 'dark');
                window.localStorage.setItem('data-theme', 'dark');
            }
        });
    },

    /**
     * Cria suavização na troca de tema
     */
    transition() {
        document.documentElement.classList.add('transition');
        window.setTimeout(() => {
            document.documentElement.classList.remove('transition');
        }, 1000);
    }
}

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
    },

    themeStorage() {
        // Consulta o dado salvo no localStorage
        let getTheme = window.localStorage.getItem('data-theme'); 

        // Atualiza o tema atual de acordo com o dado do localStorage
        document.documentElement.setAttribute('data-theme', getTheme);

        // Retorna o tema atual salvo no localStorage
        return getTheme; 
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();

        DOM.elementTransition();
    },

    remove(index) {
        Transaction.all.splice(index, 1);

        App.reload();

        DOM.elementTransition();
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

    cardTotal: document.querySelector('.total'),

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
    },
    
    changeTotalColor(total) {
        if (total < 0) {
            DOM.cardTotal.style.background = '#d42f2f';
        } else {
            DOM.cardTotal.style.background = 'var(--default-green)';
        }
    },

    elementTransition() {
        DOM.cardTotal.style.transition = '1500ms';
    }
}

const Utils = {
    formatDate(date) {
        const splittedDate = date.split('-');

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatAmount(value) {
        value *= 100;
        
        return Math.round(value);
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
        DOM.changeTotalColor(Transaction.total());
        Theme.themeSwitcher();
        Theme.mobileThemeSwitcher();
    },

    reload() {
        DOM.clearTransactions();
        DOM.changeTotalColor(Transaction.total());
        App.init();
    }
}

App.init();
