class List {
    constructor(name) {
        this.name = name;
        this.books = [];
    }
    
    static #lists = [];
    
    
    static add(list) {
        if (!this.findByName(list.name)) {
        this.#lists.push(list);
        }
    }

    static deleteByName(name) {
        this.#lists = this.#lists.filter((list) => list.name !== name);
    }

    static getAll() {
        return this.#lists;
    }

    static findByName(name) {
        return this.#lists.find((list) => list.name === name);
    }


    addBook(book) {
        if (!this.books.find(b => b.id === book.id))
            this.books.push(book);
            return book;
        }
    


    deleteBook(bookId) {
        const index = this.books.findIndex(b => b.id === bookId);
        if (index !== -1) {
            return this.books.splice(index, 1)[0];
        }
        return null;
    }


    getBooks() {
        return this.books;
    }

}




module.exports = List;