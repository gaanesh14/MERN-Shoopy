import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

function PaypalButton({ amount, onSuccess, onError }) {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Aah8YvxAZGpeakI55mnCOi4NmHi_YbfRj8gjIT11Omu76CjKVBG1CVvvx0MsLHPWmlXLyPfP1lLK5_cP", // sandbox client-id
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={(err) => {
          console.error("PayPal payment failed", err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PaypalButton;
