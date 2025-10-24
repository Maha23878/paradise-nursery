// cart.js - simple cart using localStorage
(function () {
  const STORAGE_KEY = 'pn_cart';

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function writeCart(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateHeaderCount();
  }

  function updateHeaderCount() {
    const cart = readCart();
    const total = Object.values(cart).reduce((s, it) => s + it.qty, 0);
    const cartEls = document.querySelectorAll('.cart-count-display');
    cartEls.forEach(el => el.textContent = total);
  }

  function initProductButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(btn => {
      const id = btn.getAttribute('data-id');
      const cart = readCart();
      if (cart[id]) { btn.disabled = true; btn.textContent = 'Added'; }

      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name') || '';
        const price = parseFloat(btn.getAttribute('data-price') || '0') || 0;
        const img = btn.getAttribute('data-img') || '';

        const cart = readCart();
        if (!cart[id]) {
          cart[id] = { id, name, price, img, qty: 1 };
        } else {
          cart[id].qty += 1;
        }
        writeCart(cart);
        btn.disabled = true;
        btn.textContent = 'Added';
      });
    });
  }

  function renderCartPage() {
    const cartList = document.getElementById('cart-list');
    const totalItemsEl = document.getElementById('cart-total-items');
    const totalPriceEl = document.getElementById('cart-total-price');
    if (!cartList) return;

    function draw() {
      const cart = readCart();
      const items = Object.values(cart);
      cartList.innerHTML = '';
      if (items.length === 0) {
        cartList.innerHTML = '<div>Your cart is empty.</div>';
      } else {
        items.forEach(it => {
          const row = document.createElement('div');
          row.className = 'cart-row';
          row.innerHTML = `
            <img src="${it.img || 'https://via.placeholder.com/80'}" alt="${it.name}">
            <div class="cart-info">
              <div class="name">${it.name}</div>
              <div>Unit price: $${it.price.toFixed(2)}</div>
              <div class="qty-controls">
                <button class="dec" data-id="${it.id}">-</button>
                <span class="qty">${it.qty}</span>
                <button class="inc" data-id="${it.id}">+</button>
              </div>
            </div>
            <div class="cart-actions">
              <button class="del" data-id="${it.id}">Delete</button>
            </div>
          `;
          cartList.appendChild(row);
        });
      }

      const totalCount = items.reduce((s, x) => s + x.qty, 0);
      const totalPrice = items.reduce((s, x) => s + x.qty * x.price, 0);
      if (totalItemsEl) totalItemsEl.textContent = totalCount;
      if (totalPriceEl) totalPriceEl.textContent = '$' + totalPrice.toFixed(2);

      cartList.querySelectorAll('.inc').forEach(b => {
        b.onclick = () => {
          const id = b.dataset.id;
          const cart = readCart();
          cart[id].qty += 1;
          writeCart(cart);
          draw();
        };
      });
      cartList.querySelectorAll('.dec').forEach(b => {
        b.onclick = () => {
          const id = b.dataset.id;
          const cart = readCart();
          cart[id].qty -= 1;
          if (cart[id].qty <= 0) delete cart[id];
          writeCart(cart);
          draw();
        };
      });
      cartList.querySelectorAll('.del').forEach(b => {
        b.onclick = () => {
          const id = b.dataset.id;
          const cart = readCart();
          delete cart[id];
          writeCart(cart);
          draw();
        };
      });
    }

    draw();
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateHeaderCount();
    initProductButtons();
    renderCartPage();
    const checkout = document.getElementById('checkout-btn');
    if (checkout) checkout.addEventListener('click', () => alert('Coming Soon'));
  });
})();
