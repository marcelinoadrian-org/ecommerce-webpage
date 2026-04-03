let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.add-to-cart');
  const cartSidebar = document.getElementById('cart-sidebar');
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartIcon = document.querySelector('.cart-icon');

  // Add to cart
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      cart.push({ id, name, price });
      updateCart();
      
      // Auto open cart on mobile for demo (bad UX)
      if (window.innerWidth < 768) {
        cartSidebar.classList.add('open');
      }
    });
  });

  // Toggle cart
  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('open');
  });

  // Checkout button - the main "buggy" element
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    alert(`Thank you for your purchase of $${getTotal().toFixed(2)}! 🎉\n\n(This is a demo - no real checkout)`);
    
    // Simulate slow response on mobile
    if (window.innerWidth < 768) {
      checkoutBtn.style.opacity = "0.6";
      checkoutBtn.textContent = "Processing...";
      
      setTimeout(() => {
        cart = [];
        updateCart();
        checkoutBtn.style.opacity = "1";
        checkoutBtn.textContent = "Proceed to Checkout";
        cartSidebar.classList.remove('open');
      }, 1500);
    } else {
      cart = [];
      updateCart();
      cartSidebar.classList.remove('open');
    }
  });

  function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
      totalAmount.textContent = '0.00';
      document.getElementById('cart-count').textContent = '0';
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small>$${item.price}</small>
        </div>
        <button class="remove-btn" data-index="${index}">×</button>
      `;
      cartItems.appendChild(div);
    });

    totalAmount.textContent = getTotal().toFixed(2);
    document.getElementById('cart-count').textContent = cart.length;

    // Add remove functionality
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        cart.splice(index, 1);
        updateCart();
      });
    });
  }

  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }

  // Close cart when clicking outside (buggy on mobile)
  document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-icon')) {
      cartSidebar.classList.remove('open');
    }
  });
});