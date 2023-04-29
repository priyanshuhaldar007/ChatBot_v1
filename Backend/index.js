const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bp = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
// app.use(express.json())
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
dotenv.config();

const corsOptions = {
//     origin: "http://127.0.0.1:5500",
    origin: "https://chatbotv1-frontend.netlify.app/",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/getChat", async (req, res) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.promptVal }],
    });
    // console.log(completion.data.choices[0].message);
    res.send(completion.data.choices[0].message);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server running on ${port}`);
});
