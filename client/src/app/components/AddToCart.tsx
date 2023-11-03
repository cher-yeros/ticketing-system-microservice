"use client";

import React from "react";

export default function AddToCart() {
  return (
    <button
      className="btn btn-primary"
      onClick={(e) => {
        console.log("first");
      }}
    >
      Add to cart
    </button>
  );
}
