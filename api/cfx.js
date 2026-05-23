export default async function handler(req, res) {
  const ip = String(req.query.ip || "").trim();

  if (!/^[a-zA-Z0-9.\-]+:\d{1,5}$/.test(ip)) {
    return res.status(400).json({ success: false, code: "", message: "bad ip" });
  }

  try {
    const r = await fetch("http://" + ip + "/", { redirect: "follow" });
    const text = await r.text();
    const all = String(r.url || "") + "\n" + text;

    const m = all.match(/cfx\.re\/join\/([\w-]+)/i);

    return res.status(200).json({
      success: true,
      code: m ? m[1] : "",
      final: r.url || "",
      len: text.length
    });
  } catch (e) {
    return res.status(200).json({
      success: false,
      code: "",
      message: String(e && e.message ? e.message : e)
    });
  }
}