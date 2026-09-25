module.exports = async (req, res) => {
  try {
    const r = await fetch("https://api.itbook.store/1.0/new");
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "خطا در گرفتن اطلاعات از itbook.store" });
  }
};
