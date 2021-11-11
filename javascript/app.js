//Deck Class
class Deck {
    constructor(deckName,author,usage) {
        this.deckName = deckName;
        this.author = author;
        this.usage = usage;
    }
}

//UI Class
class UI {
    static displayDecks() {
        const decks = Store.getDecks();

        decks.forEach((deck) => UI.addDeckToList(deck));
    }

    static addDeckToList(deck) {
        const list = document.querySelector('#deck-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${deck.deckName}</td>
            <td>${deck.author}</td>
            <td>${deck.usage}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteDeck(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#deck-entry');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 2500);
    }

    static clearFields() {
        document.querySelector('#deckName').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#usage').value = '';
    }
}

//Store Class
class Store {
    static getDecks() {
        let decks;
        if(localStorage.getItem('decks') === null) {
            decks = [];
        } else {
            decks = JSON.parse(localStorage.getItem('decks'));
        }

        return decks;
    }

    static addDeck(deck) {
        const decks = Store.getDecks();
        decks.push(deck);
        localStorage.setItem('decks', JSON.stringify(decks));
    }

    static removeDeck(deckName) {
        const decks = Store.getDecks();

        decks.forEach((deck, index) => {
            if(deck.deckName === deckName) {
                decks.splice(index, 1);
            }
        });

        localStorage.setItem('decks', JSON.stringify(decks));
    }
}


//Event to Display Deck
document.addEventListener('DOMContentLoaded', UI.displayDecks);

// Event to Add a Deck
document.querySelector('#deck-entry').addEventListener('submit', (e) => {

    e.preventDefault();

    const deckName = document.querySelector('#deckName').value;
    const author = document.querySelector('#author').value;
    const usage = document.querySelector('#usage').value;

    if(deckName === '' || author === '' || usage === '') {
        UI.showAlert('Please fill in all fields!', 'danger');
    } else {
        const deck = new Deck(deckName,author,usage);

        UI.addDeckToList(deck);

        Store.addDeck(deck);

        UI.showAlert('Deck added!', 'success');
    
        UI.clearFields();
    }

});

//Event to Remove Deck
document.querySelector('#deck-list').addEventListener('click', (e) => {
    UI.deleteDeck(e.target)

    Store.removeDeck(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    UI.showAlert('Deck deleted!', 'success');
});
