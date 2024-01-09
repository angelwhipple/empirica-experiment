import express from "express";
import session from "express-session";
import crypto from "crypto";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose";
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import Score from "../models/Score";

const mongoConnectionURL =
  "mongodb+srv://awhipp:wrsnmmIsGhRizTbi@empirica.inpamgh.mongodb.net/?retryWrites=true&w=majority";
const databaseName = "empirica";
const SECRET_KEY = crypto.randomBytes(32).toString("hex");

mongoose
  .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

const app = express();
app.use(express.json());
app.use(
  session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());

app.get("/leaderboard", (req, res) => {
  Score.find().then((scores) => {
    res.send({ scores: scores });
  });
});

app.post("/leaderboard/update", (req, res) => {
  Score.findOneAndUpdate(
    { identifier: req.body.identifier },
    { $inc: { score: req.body.score } },
    { upsert: true, new: true }
  ).then((updatedScore) => {
    res.send({ score: updatedScore });
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

const initLeaderboard = async () => {
  Score.find().then(async (scores) => {
    if (scores.length === 0) {
      const newScore = new Score({ identifier: "Dummy user", score: 1000 });
      await newScore.save();
    }
    console.log(`Leaderboard initialized`);
  });
};

export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  initLeaderboard();

  for (let i = 0; i < 8; i++) {
    if (i % 2 == 0) {
      const regularRound = game.addRound({
        name: "Advertise",
        task: "advertise",
      });
      regularRound.addStage({ name: "advertiseProduct", duration: 240 });
    } else {
      const resultsRound = game.addRound({ name: "Results", task: "results" });
      resultsRound.addStage({ name: "Result", duration: 140 });
    }
  }
  const finalRound = game.addRound({
    name: "Game Results",
    task: "results",
  });
  finalRound.addStage({ name: "Result", duration: 140 });
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {
  // calculateAdvertiserScore(stage);
});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateAdvertiserScore(stage) {
  if (
    stage.get("name") !== "Advertise" ||
    stage.round.get("task") !== "advertise" ||
    stage.get("name") !== "Advertise Again" ||
    stage.round.get("task") !== "advertiseAgain"
  ) {
    return;
  }

  for (const player of stage.currentGame.players) {
    console.log("calculating advertiser score");
    let adQuality = player.get("adQuality");
    let salesCount = 0;
    let randomDraw = 0;
    if (adQuality == "extraordinary") {
      randomDraw = getRandomInt(100);
      salesCount = randomDraw * 15;
    }
    {
      let randomDraw = getRandomInt(100);
      salesCount = randomDraw * 10;
    }

    player.set("numBuyers", randomDraw);

    let totalScore = player.get("score") || 0;
    player.set("salesCount", salesCount);
    player.set("score", totalScore + salesCount);
    player.set("scoreUpdated", true);
  }
}
