import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";
import { useRef } from "react";
import { get, post } from "../../util";
import "./Warrant.css";
import Leaderboard from "./Leaderboard";

export function SalesResults({ roundNumber }) {
  useEffect(() => {
    console.log(
      `Calculating round score for: ${player.get("participantIdentifier")}`
    );
    calculateScore();
  }, []);

  const player = usePlayer();
  const [leaderboard, setLeaderboard] = useState(false);
  const [results, setResults] = useState();

  const roundKey = `ROUND_${roundNumber}_CHOICES`;
  const roundChoices = player.get(roundKey);
  const productionQuality = roundChoices[0];
  const advertisementQuality = roundChoices[1];
  const priceOfProduct = roundChoices[2];
  const productionCost = roundChoices[3];
  const warrant = roundChoices[4];

  const audience = warrant ? 1000 : 100;
  const goodAd = productionQuality === advertisementQuality;
  const imageUrl =
    advertisementQuality === "high"
      ? "/images/toothpaseamazing.jpg"
      : "/images/toothpastestandard.jpg";

  const calculateScore = () => {
    const currentScore = player.get("score") || 0;

    const min = 0.1 * audience;
    const max = 0.9 * audience;
    const numBuyers = Math.floor(Math.random() * (max - min) + min);

    const minClaims = 0.1 * numBuyers;
    const maxClaims = 0.5 * numBuyers;
    const claims = Math.floor(
      Math.random() * (maxClaims - minClaims) + minClaims
    );

    const penalty = priceOfProduct * 0.5;
    const insurance = priceOfProduct * 0.1;
    const insurancePoints = claims * insurance;
    const penaltyPoints = claims * penalty;
    const warrantPoints =
      warrant && goodAd
        ? insurancePoints
        : warrant && !goodAd
        ? -penaltyPoints
        : 0;

    const salesCount = numBuyers * (priceOfProduct - productionCost);
    const roundScore = salesCount + warrantPoints;
    const finalScore = currentScore + roundScore;
    setResults({
      salesCount: salesCount,
      buyers: numBuyers,
      claims: claims,
      penalty: penalty,
      insurance: insurance,
      penaltyPoints: penaltyPoints,
      insurancePoints: insurancePoints,
      roundScore: roundScore,
      finalScore: finalScore,
    });
  };

  useEffect(() => {
    if (results) {
      post("/leaderboard/update", {
        identifier: player.get("participantIdentifier"),
        score: results.finalScore,
      }).then((res) => console.log(`Leaderboard updated`));
    }
  }, [results]);

  function handleSubmit() {
    console.log("Next round");
    player.stage.set("submit", true);
    player.set("score", results.finalScore);
  }

  return (
    <>
      {leaderboard ? (
        <Leaderboard setLeaderboard={setLeaderboard}></Leaderboard>
      ) : (
        <></>
      )}
      {results ? (
        <div className="mt-3 sm:mt-5 p-20">
          <h1 className="text-lg leading-6 font-medium text-gray-900">Sales</h1>
          <div className="text-lg mt-2 mb-6">
            <p>
              You chose to produce a <b>{productionQuality}</b> quality product.
            </p>
            <p>
              You chose to advertise it as a <b>{advertisementQuality}</b>{" "}
              quality product. You sold it at a price of{" "}
              <b>${priceOfProduct}</b>.
              <br /> <br />
            </p>

            <img
              src={imageUrl}
              alt="Toothpaste Standard"
              width="250"
              height="250"
            />

            <p>
              It was advertised to an audience of {audience} users, and{" "}
              {results.buyers} users bought your product.
            </p>

            <p>
              You earned ${priceOfProduct - productionCost} per product x{" "}
              {results.buyers} units sold = {results.salesCount} points in
              sales.
            </p>

            {warrant ? (
              <>
                <br></br>
                <p>
                  Of those {results.buyers} customers, {results.claims} of them
                  challenged your ad warranty with false advertising claims.
                </p>
                {goodAd ? (
                  <p>
                    Luckily, your product was sold as advertised. You gain an
                    additional ${results.insurance} in insurance x{" "}
                    {results.claims} customers = {results.insurancePoints}{" "}
                    points.
                  </p>
                ) : (
                  <p>
                    Unfortunately, you falsely advertised your product. You lose
                    ${results.penalty} in fees x {results.claims} customers = -
                    {results.penaltyPoints} points.
                  </p>
                )}
              </>
            ) : (
              <></>
            )}
            <br />
            <p> Your score for this round is: {results.roundScore} </p>
            <p> Your total score is: {results.finalScore} </p>
            <br />
            <p>
              Click to proceed to the next round to sell products in this
              marketplace.
            </p>
          </div>
          <div className="horizontal-flex">
            <Button handleClick={handleSubmit} primary>
              I'm done!
            </Button>
            <Button handleClick={() => setLeaderboard(true)}>
              View leaderboard
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
