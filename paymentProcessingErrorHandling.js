function isValidLuhn(cardNumber) {
  const digits = String(cardNumber).replace(/\D/g, '');
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  let doubleNext = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (doubleNext) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    doubleNext = !doubleNext;
  }
  return sum % 10 === 0;
}

function parseExpiry(exp) {
  if (!exp || typeof exp !== 'string') return null;
  const parts = exp.split('/');
  if (parts.length !== 2) return null;
  const mm = Number(parts[0].trim());
  const yyStr = parts[1].trim();
  if (!Number.isInteger(mm) || mm < 1 || mm > 12) return null;

  // Support YY or YYYY
  let yyyy = Number(yyStr);
  if (!Number.isInteger(yyyy)) return null;
  if (yyStr.length === 2) {
    const now = new Date();
    const currentCentury = Math.floor(now.getFullYear() / 100) * 100;
    yyyy = currentCentury + yyyy;
    // Pivot window: if result is more than 50 years in the past, roll to next century
    if (yyyy < now.getFullYear() - 50) yyyy += 100;
  }
  if (yyyy < 1000 || yyyy > 9999) return null;
  return { month: mm, year: yyyy };
}

function isExpiryInFuture(exp) {
  const parsed = parseExpiry(exp);
  if (!parsed) return false;
  const { month, year } = parsed;
  const now = new Date();
  // Consider valid through end of the expiration month
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
  return endOfMonth >= now;
}

function processPayment(amount, cardNumber, expirationDate) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid payment amount.');
  }
  if (!cardNumber || !isValidLuhn(cardNumber)) {
    throw new Error('Invalid card number.');
  }
  if (!expirationDate || !isExpiryInFuture(expirationDate)) {
    throw new Error('Invalid expiration date.');
  }
  return {
    status: 'success',
    amount,
    last4: String(cardNumber).replace(/[^0-9]/g, '').slice(-4),
  };
}

// Demo
try {
  processPayment(50.25, '4242 4242 4242 4242', '12/25');
  processPayment(-10, 'invalidCardNumber', '5/25/21'); // Should throw: "Invalid payment amount." and "Invalid card number."
  processPayment(100.75, '79927398713', '02/21'); // Should throw: "Invalid expiration date."
} catch (error) {
  console.error(error.message);
}

module.exports = { processPayment, isValidLuhn, parseExpiry, isExpiryInFuture };