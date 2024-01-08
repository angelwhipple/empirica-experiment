import {
  Slider,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { MdInfoOutline } from "react-icons/md";
import { useEffect } from "react";
import { get, post } from "../../util";
import "../components/Modal.css";
import "./Leaderboard.css";

const Leaderboard = (props) => {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();

  const [scores, setScores] = useState([]);

  useEffect(() => {
    get("/leaderboard").then((res) => {
      console.log(res);
      const scoreElems = [];
      for (const scoreInfo of res.scores) {
        scoreElems.push(
          <div key={scoreInfo._id} className="score-container">
            <p>
              <strong>{scoreInfo.identifier}</strong>
            </p>
            <p>{scoreInfo.score}</p>
          </div>
        );
      }
      setScores(scoreElems);
    });
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <p>
            <strong>Producer Leaderboard</strong>
          </p>
          <div className="score-display">{scores}</div>
          <Button handleClick={() => props.setLeaderboard(false)}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
