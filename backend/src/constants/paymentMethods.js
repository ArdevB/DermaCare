export const PAYMENT_METHODS = Object.freeze({
  COD: "cod",
  BANK_TRANSFER: "bank_transfer",
  KHALTI: "khalti",
  ESEWA: "esewa",
});

export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHODS);

// Methods that require an online gateway redirect/verification flow
export const ONLINE_PAYMENT_METHODS = [
  PAYMENT_METHODS.KHALTI,
  PAYMENT_METHODS.ESEWA,
];
