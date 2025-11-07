const cart = [];

function addToCart(name, price, quantity) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Product name is required.');
  }
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    throw new Error('Invalid product price.');
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Invalid quantity.');
  }
  const item = { name: name.trim(), price, quantity };
  cart.push(item);
  return item;
}

function checkout() {
  if (cart.length === 0) {
    throw new Error('Cart is empty. Add items before checkout.');
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items: cart.slice(), total };
}

// Demo
try {
  addToCart('Laptop', 1200, 2);
  addToCart('', 30, 1); // Should throw: "Product name is required."
  addToCart('Mouse', -15, 3); // Should throw: "Invalid product price."
  addToCart('Keyboard', 50, 'abc'); // Should throw: "Invalid quantity."

  const receipt = checkout(); // If no errors earlier and cart not empty
  console.log('Checkout success:', receipt);
} catch (error) {
  console.error(error.message);
}

module.exports = { addToCart, checkout, cart };