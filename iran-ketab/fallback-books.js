// fallback-books.js
// Built-in books shown by app-oop.js when /api/new-books fails or returns nothing.
// Same shape as the API response: { title, subtitle (author), image, price, url }.
// Images are the local files in ./image/.

const fallbackBooks = [
  ["Maxims", "La Rochefoucauld", "book11"],
  ["Malevil", "Robert Merle", "book12"],
  ["More Iranian", "Nahal Tajaddod", "book13"],
  ["Pieces of a Coherent Whole", "Pooneh Moghimi", "book14"],
  ["The Double", "Fyodor Dostoevsky", "book15"],
  ["Man's Search for Meaning", "Viktor Frankl", "book16"],
  ["Divan Hafez", "Hafez", "book17"],
  ["Three Buddhist Monks of Japan", "Saigyo Hoshi", "book18"],
  ["Grandma's Stories", "Saeed Razaghi", "book19"],
  ["Winter Champion", "W.D.", "book20"],
  ["Space Neighbor", "A.I. Newton", "book21"],
  ["Carefree Holidays", "David Sedaris", "book22"],
  ["Journey to the World of Energies", "Maryam Navidi", "book23"],
  ["History of Italian Cinema", "Mario Verdone", "book24"],
  ["Library Lion", "Michelle Knudsen", "book29"],
].map(([title, subtitle, img]) => ({
  title,
  subtitle,
  image: `./image/${img}`,
  price: "Featured book",
  url: `https://openlibrary.org/search?q=${encodeURIComponent(`${title} ${subtitle}`)}`,
}));
