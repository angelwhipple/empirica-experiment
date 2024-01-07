import {
  Slider,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { MdInfoOutline } from "react-icons/md";
import "./Warrant.css";
import Modal from "../components/Modal";

const Warrant = (props) => {
  const [modal, setModal] = useState(false);
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();

  return (
    <>
      {modal ? <Modal setModal={setModal}></Modal> : <></>}
      <div className="warrant-container">
        <div className="horizontal-flex">
          <MdInfoOutline
            className="info-icon"
            onClick={() => setModal(true)}
          ></MdInfoOutline>
          <p>
            <strong>Purchase a warrant for this advertisement for $100?</strong>
          </p>
        </div>
        <div className="horizontal-flex">
          <Button handleClick={() => player.round.set("warrant", true)}>
            Yes
          </Button>
          <Button handleClick={() => player.round.set("warrant", false)}>
            No
          </Button>
        </div>
      </div>
    </>
  );
};

export default Warrant;
