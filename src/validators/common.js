/* eslint-disable prefer-promise-reject-errors */

export const greater_than_zero = input => {
  return input > 0;
};

export const payment_id = input => {
  return input.length === 0 || (/^[0-9A-Fa-f]+$/.test(input) && (input.length == 16 || input.length == 64));
};

export const privkey = input => {
  return input.length === 0 || (/^[0-9A-Fa-f]+$/.test(input) && input.length == 64);
};

export const service_node_key = input => {
  return input.length === 64 && /^[0-9A-Za-z]+$/.test(input);
};

export const session_id = input => {
  return input.length == 66 && /^05[0-9A-Za-z]+$/.test(input);
};

export const lns_name = input => {
  return input.length === 0 || /^[a-z0-9_]([a-z0-9-_]*[a-z0-9_])?$/.test(input.toLowerCase());
};

export const address = (input, gateway) => {
  if (!/^[0-9A-Za-z]+$/.test(input)) return false;

  // Validate the address
  return new Promise((resolve, reject) => {
    gateway.once("validate_address", data => {
      if (data.address && data.address !== input) {
        reject();
      } else {
        if (data.valid) {
          resolve();
        } else {
          reject();
        }
      }
    });
    gateway.send("wallet", "validate_address", {
      address: input
    });
  });
};
