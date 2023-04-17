import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import dayjs from "dayjs";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
dayjs().format();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message));

app.post("/participants", async (req, res) => {
    const newParticipantsSchema = joi.object({
        name: joi.string().required()
    });
    const newParticipant = req.body;
    const validation = newParticipantsSchema.validate(newParticipant, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const { name } = newParticipant;
    const participant = await db.collection("participants").findOne({ name: name });
    if (participant) return res.status(409).send("Esse nome está sendo já está sendo usado");

    await db.collection("participants").insertOne({
        name: name,
        lastStatus: Date.now()
    });

    await db.collection("messages").insertOne({
        from: name,
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: dayjs().format("HH:mm:ss")
    });

    return res.status(201).send(201);

})

app.get("/participants", async (req, res) => {
    const participants = await db.collection("participants").find().toArray();

    if (participants) return res.send(participants);
    return res.send([]);

})

app.post("/messages", async (req, res) => {
    const newMessagesSchema = joi.object({
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().valid("message", "private_message")
    });
    const newMessage = req.body;
    const { to, text, type } = newMessage;
    const validation = newMessagesSchema.validate(newMessage, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const from = req.headers.user;
    const participant = await db.collection("participants").findOne({ name: from });
    if (!participant) return res.status(422).send("Esse usúario não está na sala");

    await db.collection("messages").insertOne({
        from,
        to,
        text,
        type,
        time: dayjs().format("HH:mm:ss")
    });

    return res.status(201).send(201);

})

app.get("/messages", async (req, res) => {
    const user = req.headers.user;
    const limit = parseInt(req.query.limit);
    console.log(req.query.limit);
    const messages = await db.collection("messages").find({ $or: [{ from: user }, { to: user }, { to: "Todos" }] })
    if (limit = undefined) return res.send(messages);
    if (!limit || limit <= 0) return res.status(422).send(422);
    const limitedMessages = messages.slice(0, limit)
    return res.send(limitedMessages)
})
const PORT = 5000;
app.listen(PORT, () => console.log(`Rodando servidor na porta ${PORT}`));