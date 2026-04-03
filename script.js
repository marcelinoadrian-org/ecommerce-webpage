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
        const originalColor = btn.style.backgroundColor || "#3498db";
        
        btn.textContent = "Added ✓";
        btn.style.background = "#27ae60";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = originalColor;
        }, 800);

        updateCart();

        // Auto-open cart on mobile only
        if (window.innerWidth <= 768) {
          setTimeout(() => cartSidebar.classList.add('open'), 300);
        }
      });
    });

    // Toggle cart sidebar
    cartIcon.addEventListener('click', () => {
      cartSidebar.classList.toggle('open');
    });

    // Checkout button with better user feedback
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        checkoutBtn.style.transition = "all 0.2s";
        checkoutBtn.style.transform = "scale(0.95)";
        setTimeout(() => checkoutBtn.style.transform = "scale(1)", 150);
        alert("🛒 Your cart is empty!");
        return;
      }

      const originalText = checkoutBtn.textContent;
      const originalBg = checkoutBtn.style.background;

      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "Processing...";
      checkoutBtn.style.background = "#f39c12";

      // Simulate API call delay
      setTimeout(() => {
        alert(`🎉 Thank you! Your order has been placed.\n\nTotal: $${getTotal().toFixed(2)}`);

        // Clear the cart
        cart = [];
        updateCart();
        cartSidebar.classList.remove('open');

        // Reset button state
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalText;
        checkoutBtn.style.background = originalBg || "#27ae60";
      }, 1600);
    });

    // Update cart UI
    function updateCart() {
      const cartItems = document.getElementById('cart-items');
      const totalAmount = document.getElementById('total-amount');
      const cartCount = document.getElementById('cart-count');

      cartItems.innerHTML = '';

      if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color:#777; text-align:center; padding:30px 10px;">Your cart is empty.</p>';
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
          <button class="remove-btn" data-index="${index}" title="Remove item">×</button>
        `;
        cartItems.appendChild(div);
      });

      totalAmount.textContent = getTotal().toFixed(2);
      cartCount.textContent = cart.length;

      // Attach remove event listeners
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(btn.dataset.index);
          if (!isNaN(index)) {
            cart.splice(index, 1);
            updateCart();
          }
        });
      });
    }

    // Calculate total price
    function getTotal() {
      return cart.reduce((sum, item) => sum + item.price, 0);
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!cartSidebar.contains(e.target) && 
          !e.target.closest('.cart-icon') && 
          !e.target.closest('.checkout-button')) {
        cartSidebar.classList.remove('open');
      }
    });

    // Close cart with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
      }
    });

    // Bonus: Add smooth scroll to top when cart opens on mobile
    const originalOpen = cartSidebar.classList.add;
    cartSidebar.classList.add = function(...args) {
      if (args.includes('open') && window.innerWidth <= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return originalOpen.apply(this, args);
    };
  });