import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";
import { useRef } from "react";

export function SalesResults({ roundNumber }) {
  console.log("calculating advertiser score");
  const player = usePlayer();
  const roundNumberText = "round" + roundNumber;

  //const adQuality = player.get("adQuality");
  const productionQuality = player.get(roundNumberText.concat("_choices"))[0];
  const advertisementQuality = player.get(
    roundNumberText.concat("_choices")
  )[1];
  const priceOfProduct = player.get(roundNumberText.concat("_choices"))[2];
  const productionCost = player.get(roundNumberText.concat("_choices"))[3];
  let imageUrl = "";
  //console.log('roundNumberText', roundNumberText)
  if (advertisementQuality === "high") {
    imageUrl = "/images/toothpaseamazing.jpg"; // Replace with the actual URL for high quality
  } else if (advertisementQuality === "low") {
    imageUrl = "/images/toothpastestandard.jpg"; // Replace with the actual URL for low quality
  }

  const currentScore = player.get("score") || 0; // , adQuality, points, salesCount, numBuyers

  const warrant = player.get(roundNumberText.concat("_choices"))[4];

  const penalty = priceOfProduct * 0.5;
  const insurance = priceOfProduct * 0.1;
  const audience = warrant ? 1000 : 100;

  let points = priceOfProduct;

  const min = 0.1 * audience;
  const max = 0.9 * audience;

  //  switch (advertisementQuality){
  //    case "high":
  //      switch (priceOfProduct) {case "high": min = 50; break; case "low": min = 70; break;
  //      };
  //    case "low":
  //      switch (priceOfProduct) {case "high": min =10, max=20; break; case "low": min = 50, max = 80; break;}
  //  }
  const numBuyers = Math.floor(Math.random() * (max - min) + min);

  const minClaims = 0.1 * numBuyers;
  const maxClaims = 0.5 * numBuyers;
  const claims = Math.floor(
    Math.random() * (maxClaims - minClaims) + minClaims
  );
  const insurancePoints = claims * insurance;
  const penaltyPoints = claims * penalty;
  const goodAd = productionQuality === advertisementQuality;

  const warrantPoints =
    warrant && goodAd
      ? insurancePoints
      : warrant && !goodAd
      ? -penaltyPoints
      : 0;

  const salesCount = numBuyers * (priceOfProduct - productionCost);
  const roundScore = salesCount + warrantPoints;
  const finalScore = currentScore + roundScore;

  function handleSubmit() {
    console.log("Moving on from results round");
    player.stage.set("submit", true);
    player.set("score", finalScore);
  }

  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h1 className="text-lg leading-6 font-medium text-gray-900">Sales</h1>
      <div className="text-lg mt-2 mb-6">
        {/* <p className="text-sm text-gray-500"> */}
        <p>
          You chose to produce a <b>{productionQuality}</b> quality product.
        </p>
        <p>
          You chose to advertise it as a <b>{advertisementQuality}</b> quality
          product. You sold it at a price of <b>${priceOfProduct}</b>.
          <br /> <br />
        </p>

        <img
          src={imageUrl}
          alt="Toothpaste Standard"
          width="250"
          height="250"
        />

        <p>
          It was advertised to an audience of {audience} users, and {numBuyers}{" "}
          users bought your product.
        </p>

        <p>
          You earned ${priceOfProduct - productionCost} per product x{" "}
          {numBuyers} units sold = {salesCount} points in sales.
        </p>

        {warrant ? (
          <>
            <br></br>
            <p>
              Of those {numBuyers} customers, {claims} of them challenged your
              ad warranty with false advertising claims.
            </p>
            {goodAd ? (
              <p>
                Luckily, your product was sold as advertised. You gain an
                additional ${insurance} in insurance x {claims} customers ={" "}
                {insurancePoints} points.
              </p>
            ) : (
              <p>
                Unfortunately, you falsely advertised your product. You lose $
                {penalty} in fees x {claims} customers = -{penaltyPoints}{" "}
                points.
              </p>
            )}
          </>
        ) : (
          <></>
        )}
        <br />
        <p> Your score for this round is: {roundScore} </p>
        <p> Your total score is: {finalScore} </p>
        <br />
        <p>
          Click to proceed to the next round to sell products in this
          marketplace.
        </p>
      </div>
      <Button handleClick={handleSubmit} primary>
        I'm done!
      </Button>
    </div>
  );
}
