export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { table, items, total, name } = req.body;
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const toUserId = process.env.LINE_ADMIN_USER_ID;

  if (!token || !toUserId) {
    return res.status(500).json({ error: "Missing LINE config" });
  }

  const message = `🔔 ออเดอร์ใหม่!\n📍 โต๊ะ ${table}\n👤 ${name}\n\n${items}\n\n💰 รวม ฿${total}`;

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: toUserId,
        messages: [{ type: "text", text: message }],
      }),
    });

    const data = await response.json();
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
