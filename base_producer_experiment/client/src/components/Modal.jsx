import "./Modal.css";
import { Button } from "./Button";
import React from "react";

const Modal = (props) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <p>
            <strong>Warrant your advertisement</strong>
          </p>
          <p>
            For only $100, guarantee the validity of this ad and push it to a
            larger audience of customers.
          </p>
          <p>
            Warning: This does not protect your ad from false advertising
            claims.
          </p>
          <p>
            False ads with warranties are subject to a penalty fee equivalent to
            50% of the product price, per claim.
          </p>
          <p>
            Truthfully advertised products are rewarded with 10% of the product
            price in advertising insurance, per claim.
          </p>
          <Button handleClick={() => props.setModal(false)}>
            I understand
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
