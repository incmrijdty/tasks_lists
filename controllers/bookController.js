const axios = require('axios');
//const GOOGLE_API_KEY = 'AIzaSyDnIPEnZ-IFH12AqKF3_lBdzmGjWIkgDoc'; 
const { STATUS_CODE } = require("../constants/statusCode");
const { MENU_LINKS } = require('../constants/navigation');
const List = require('../models/listModel');

function ensureDefaultLists() {
  const defaultNames = ['Favourites', 'Read', 'To Be Read'];

  defaultNames.forEach(name => {
    if (!List.findByName(name)) {
      List.add(new List(name));
    }
  });
} 

ensureDefaultLists();

exports.searchBooks = async (req, res) => {
  let { q, subject, year, author } = req.query;
  if (!q) return res.status(STATUS_CODE.NOT_FOUND).render("404.ejs", {
    headTitle: "404",
    activeLinkPath: '', 
    menuLinks: MENU_LINKS,
  });

  try {
    const params = new URLSearchParams();

    params.append("q", q);
    if (author) params.append("author", author);
    if (subject) params.append("subject", subject);
    params.append("limit", "100");

    year = year ? (Array.isArray(year) ? year : [year]) : [];

    
    const response = await axios.get(`https://openlibrary.org/search.json?${params.toString()}`);
    const docs = response.data.docs || [];
    

    let books = docs.map(item => ({
      id: item.key,
      title: item.title,
      authors: item.author_name || [],
      description: item.first_sentence?.[0] || '',
      thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : '',
      year: item.first_publish_year || 'Unknown',
      subjects: item.subject || ["Unknown"]
    }));

    if (year.length > 0) {
      books = books.filter(book => year.includes(String(book.year)));
    }

    const favouritesList = List.findByName("Favourites");
    const readList = List.findByName("Read");
    const toBeReadList = List.findByName("To Be Read");

    const savedLists = List.getAll();
    res.render('search.ejs', {
      books,
      query: q,
      subject,
      year,
      author,
      menuLinks: MENU_LINKS,
      activeLinkPath: "/search",
      favouritesList,
      readList,
      toBeReadList,
      savedLists,
    });

    //to add: no results found

  } catch (error) {
    console.error('Error fetching books:', error); //change 404.ejs to just errors
    res.status(STATUS_CODE.INTERNAL_SERVER).json({ message: 'Failed to fetch books', error: error.message });
  }
};

exports.getHomeView = (req, res) => {
    
    res.render("bookHomePage.ejs", {
      headTitle: "Home",
      path: "/",
      activeLinkPath: '/', 
      menuLinks: MENU_LINKS,
    });
  };
