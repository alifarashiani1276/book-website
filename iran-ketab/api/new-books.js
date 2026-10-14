// api/new-books.js
// منبع داده: Open Library (رایگان، بدون API Key، بدون محدودیت سخت‌گیرانه)
// خروجی دقیقاً همان فرمتی است که app-oop.js انتظار دارد:
//   { books: [ { title, subtitle, image, price, url } ] }
// بنابراین نیازی به تغییر هیچ خطی از جاوااسکریپت فرانت‌اند نیست.

const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const COVER_URL = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

const FIELDS = [
  "key",
  "title",
  "author_name",
  "cover_i",
  "first_publish_year",
  "ebook_access",
].join(",");

const MAX_BOOKS = 20;

// اگر Open Library هم در دسترس نبود، صفحه خالی نمی‌ماند
const FALLBACK_BOOKS = [
  ["Grandma's Stories", "Saeed Razaghi", "book19"],
  ["Divan Hafez", "Hafez", "book17"],
  ["Three Buddhist Monks of Japan", "Saigyo Hoshi", "book18"],
  ["Winter Champion", "W.D.", "book20"],
  ["Space Neighbor", "A.I. Newton", "book21"],
  ["Carefree Holidays", "David Sedaris", "book22"],
  ["Journey to the World of Energies", "Maryam Navidi", "book23"],
  ["History of Italian Cinema", "Mario Verdone", "book24"],
].map(([title, subtitle, img]) => ({
  title,
  subtitle,
  image: `/image/${img}`,
  price: "Sample book",
  url: "#",
}));

async function searchOpenLibrary(query, sort, limit) {
  const params = new URLSearchParams({
    q: query,
    sort,
    limit: String(limit),
    fields: FIELDS,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const r = await fetch(`${OPEN_LIBRARY_SEARCH}?${params}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        // Open Library از کلاینت‌ها می‌خواهد خودشان را معرفی کنند
        "User-Agent": "Folio/1.0 (book store demo)",
      },
    });
    if (!r.ok) throw new Error(`Open Library status: ${r.status}`);
    const data = await r.json();
    return data.docs || [];
  } finally {
    clearTimeout(timer);
  }
}

function accessLabel(doc) {
  if (doc.ebook_access === "public") return "Free to read";
  if (doc.ebook_access === "borrowable") return "Free to borrow";
  if (doc.first_publish_year) return `First published ${doc.first_publish_year}`;
  return "View details";
}

function toBook(doc) {
  const authors = Array.isArray(doc.author_name) ? doc.author_name : [];
  return {
    title: doc.title || "",
    // app-oop.js عنوان فرعی را زیر اسم کتاب نشان می‌دهد؛ اینجا نام نویسنده را می‌گذاریم
    subtitle: authors.slice(0, 2).join(", ") || "Unknown author",
    image: COVER_URL(doc.cover_i),
    price: accessLabel(doc),
    url: `https://openlibrary.org${doc.key}`,
  };
}

function cleanList(docs) {
  const seen = new Set();
  const year = new Date().getFullYear();

  return docs
    .filter((d) => d.cover_i && d.title && d.key)
    .filter((d) => !d.first_publish_year || d.first_publish_year <= year)
    .filter((d) => {
      const k = d.title.trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, MAX_BOOKS)
    .map(toBook);
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

  try {
    const year = new Date().getFullYear();

    // ۱) تازه‌ترین رمان‌های اخیر
    let books = cleanList(
      await searchOpenLibrary(
        `subject:fiction AND first_publish_year:[${year - 3} TO ${year}]`,
        "new",
        80,
      ),
    );

    // ۲) اگر نتیجه کم بود، پرامتیازترین رمان‌ها
    if (books.length < 8) {
      books = cleanList(await searchOpenLibrary("subject:fiction", "rating", 80));
    }

    if (books.length === 0) throw new Error("Open Library returned no books");

    res.status(200).json({ books });
  } catch (err) {
    console.error(err);
    // به‌جای خطای ۵۰۰، لیست آماده برمی‌گردد تا سایت خالی نماند
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Books-Source", "fallback");
    res.status(200).json({ books: FALLBACK_BOOKS });
  }
};