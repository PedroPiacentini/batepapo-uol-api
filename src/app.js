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
        time: dayjs().format("HH:mm:SS")
    });

    return res.status(201);

})

app.get("/participants", async (req, res) => {
    const participants = await db.collection("participants").find().toArray();

    if (participants) return res.send(participants);
    return res.send([]);

})

const PORT = 5000;
app.listen(PORT, () => console.log(`Rodando servidor na porta ${PORT}`));