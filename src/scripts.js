const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}

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

function transition() {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
    }, 1000);
}

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