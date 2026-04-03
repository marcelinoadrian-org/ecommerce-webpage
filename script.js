let cart = [];

  document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-to-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartIcon = document.querySelector('.cart-icon');

    // Add to cart with visual feedback
    addButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);

        cart.push({ name, price });

        // Visual feedback
        const originalText = btn.textContent;
        const originalColor = btn.style.backgroundColor;
        
        btn.textContent = "Added ✓";
        btn.style.background = "#27ae60";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = originalColor || "#3498db";
        }, 800);

        updateCart();

        // Auto-open cart on mobile
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            cartSidebar.classList.add('open');
          }, 300);
        }
      });
    });

    // Toggle cart sidebar
    cartIcon.addEventListener('click', () => {
      cartSidebar.classList.toggle('open');
    });

    // Checkout button logic
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        checkoutBtn.style.transition = "all 0.2s";
        checkoutBtn.style.transform = "scale(0.95)";
        setTimeout(() => {
          checkoutBtn.style.transform = "scale(1)";
        }, 150);
        alert("🛒 Your cart is empty!");
        return;
      }

      const originalText = checkoutBtn.textContent;
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "Processing Payment...";
      checkoutBtn.style.background = "#f39c12";

      setTimeout(() => {
        alert(`🎉 Order placed successfully!\n\nTotal: $${getTotal().toFixed(2)}\n\nThank you for shopping at BuggyCart!`);

        cart = [];
        updateCart();
        cartSidebar.classList.remove('open');

        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalText;
        checkoutBtn.style.background = "#27ae60";
      }, 1400);
    });

    // Update cart display
    function updateCart() {
      const cartItems = document.getElementById('cart-items');
      const totalAmount = document.getElementById('total-amount');
      const cartCount = document.getElementById('cart-count');

      cartItems.innerHTML = '';

      if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color:#777; text-align:center; padding:20px;">Your cart is empty.</p>';
        totalAmount.textContent = '0.00';
        cartCount.textContent = '0';
        return;
      }

      cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <div>
            <strong>${item.name}</strong><br>
            <small>$${item.price.toFixed(2)}</small>
          </div>
          <button class="remove-btn" data-index="${index}">×</button>
        `;
        cartItems.appendChild(div);
      });

      totalAmount.textContent = getTotal().toFixed(2);
      cartCount.textContent = cart.length;

      // Remove buttons
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(btn.dataset.index);
          cart.splice(index, 1);
          updateCart();
        });
      });
    }

    // Calculate total
    function getTotal() {
      return cart.reduce((sum, item) => sum + item.price, 0);
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (!cartSidebar.contains(e.target) &&
          !e.target.closest('.cart-icon') &&
          !e.target.closest('.checkout-button')) {
        cartSidebar.classList.remove('open');
      }
    });

    // Close cart with ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        cartSidebar.classList.remove('open');
      }
    });
  });