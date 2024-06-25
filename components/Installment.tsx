"use client";

import { type ChangeEvent, useState } from "react";

interface InstallmentProps {
  styles: any;
  productItem: { item: string; price: number; emoji: string };
}

export const Installment = (props: InstallmentProps) => {
  const [months, setMonths] = useState(1);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMonths(Number(event.target.value));
  };

  const monthlyPayment = (props.productItem.price / months).toFixed(2);

  return (
    <div
      className="p-6 shadow-md rounded-lg max-w-md mx-auto"
      style={props.styles}
    >
      <div className="flex mb-4 justify-center text-lg space-x-3">
        <span className="font-semibold">{props.productItem.item}</span>
        <span>{props.productItem.emoji}</span>
      </div>
      <div className="mb-4 text-lg">
        Toal Amount:{" "}
        <span className="font-semibold">${props.productItem.price}</span> USD
      </div>
      <div className="mb-4">
        <label htmlFor="months" className="block text-sm mb-2">
          Installment Duration (in months):{" "}
          <span className="font-semibold">{months}</span>
        </label>
        <input
          type="range"
          id="months"
          name="months"
          min="1"
          max="60"
          value={months}
          onChange={handleSliderChange}
          className="w-full"
        />
      </div>
      <div className="text-lg">
        Your monthly payment is:{" "}
        <span className="font-semibold">${monthlyPayment}</span> USD
      </div>
    </div>
  );
};
