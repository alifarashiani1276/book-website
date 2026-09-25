module.exports = async (req, res) => {
  try {
    const r = await fetch(
      "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=20",
    );

    if (!r.ok) {
      throw new Error(`Google Books API status: ${r.status}`);
    }

    const data = await r.json();

    // دیتای گوگل رو به شکلی که فرانت‌اند انتظار داره (books: [...]) تبدیل می‌کنیم
    const books = (data.items || []).map((item) => {
      const info = item.volumeInfo || {};
      const saleInfo = item.saleInfo || {};

      return {
        title: info.title || "",
        subtitle: info.subtitle || "",
        image: info.imageLinks
          ? (
              info.imageLinks.thumbnail ||
              info.imageLinks.smallThumbnail ||
              ""
            ).replace("http://", "https://")
          : "",
        price:
          saleInfo.saleability === "FOR_SALE" && saleInfo.listPrice
            ? `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}`
            : "رایگان / موجود نیست",
        url: info.infoLink || info.previewLink || "#",
      };
    });

    res.status(200).json({ books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
