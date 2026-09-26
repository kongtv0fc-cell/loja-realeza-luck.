import express from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
app.use(express.json());

// rota para servir o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.post("/api/gerar-pix", async (req, res) => {
  const { valor } = req.body;

  const resposta = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      transaction_amount: valor,
      description: "Compra Loja da Realeza LUCK",
      payment_method_id: "pix",
      payer: { email: "cliente@email.com" }
    })
  });

  const dados = await resposta.json();
  res.json({ qr_code: dados.point_of_interaction.transaction_data.qr_code });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
