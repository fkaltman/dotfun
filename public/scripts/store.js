(function store() {
  function ready() {
    const productsContainer = document.querySelector('#store-products');
    const addToCartButtons = document.getElementsByClassName('cart-button-store');
    const details = document.querySelectorAll('.details-button-store');
    const removeCartItemButtons = document.getElementsByClassName('btn-danger');
    const quantityInputs = document.getElementsByClassName('cart-quantity-input');
    const gotoCartButton = document.querySelector('.goto-cart');
    const stickyCart = document.querySelector('.sticky-cart');
    const checkoutButton = document.getElementsByClassName('btn-checkout')[0];
    const keepShoppingButton = document.getElementsByClassName('btn-keep-shopping')[0];
    const paypalButtonContainer = document.querySelector('#paypal-button-container');
    const cartContents = [];
    let cartTotal = 0;
    let cartSubtotal = 0;
    let shipping = 0;

    function updateCart() {
      class CartItem {
        constructor(title, price, quantity) {
          this.title = title;
          this.price = price;
          this.quantity = quantity;
        }
      }

      cartContents.splice(0, cartContents.length);

      const cartItemContainer = document.getElementsByClassName('cart-items')[0];
      const cartRows = cartItemContainer.getElementsByClassName('cart-row');
      cartSubtotal = 0;
      shipping = 0;
      for (let i = 0; i < cartRows.length; i += 1) {
        const titleElement = cartRows[i].getElementsByClassName('cart-item-title')[0];
        const priceElement = cartRows[i].getElementsByClassName('cart-price')[0];
        const quantityElement = cartRows[i].getElementsByClassName('cart-quantity-input')[0];
        const title = titleElement.innerText;
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        cartContents.push(new CartItem(title, price, quantity));
        cartSubtotal = Math.round(cartSubtotal * 100) / 100;
        cartSubtotal += price * quantity;
      }

      for (let i = 0; i < cartContents.length; i += 1) {
        if (cartContents[i].title.includes('Vinyl')) {
          shipping = 5;
          break;
        } else if (cartContents[i].title.includes('Test')) {
          shipping = 0.01;
          break;
        } else {
          shipping = 3;
        }
      }

      cartTotal = `${cartSubtotal + shipping}`;

      let totalItems = 0;

      for (let i = 0; i < cartContents.length; i += 1) {
        totalItems += parseInt(cartContents[i].quantity, 10);
      }

      document.getElementsByClassName('cart-subtotal-price')[0].innerText = `$${cartSubtotal}`;
      document.getElementsByClassName('cart-shipping-price')[0].innerText = `$${shipping}`;
      document.getElementsByClassName('cart-total-price')[0].innerText = `$${cartTotal}`;
      document.querySelector('.sticky-cart-items').innerText = `Items:  ${totalItems}`;
      document.querySelector('.sticky-cart-subtotal').innerText = `subtotal:  $${cartSubtotal}`;
    }

    function gotoCartClicked() {
      document.querySelector('.content-section').scrollIntoView();
    }

    function quantityChanged(event) {
      const input = event.target;
      const title = `${this.parentElement.parentElement.children[0].children[0].innerText}`;
      fetch('/modal')
        .then(res => res.json())
        .then(data => {
          for (let i = 0; i < data.products.length; i += 1) {
            if (title === data.products[i].title && input.value > data.products[i].stockQty) {
              Swal.fire(`There are only ${data.products[i].stockQty} left in stock`);
              input.value = `${data.products[i].stockQty}`;
              updateCart();
            } else if (input.value <= data.products[i].stockQty) {
              updateCart();
            }
          }
          if (Number.isNaN(input.value) || input.value <= 0) {
            input.value = 1;
            updateCart();
          }
        });
    }

    function removeCartItem(event) {
      const buttonClicked = event.target;
      buttonClicked.parentElement.parentElement.remove();
      updateCart();
    }

    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    function addItemToCart(title, price) {
      const cartRow = document.createElement('div');
      cartRow.classList.add('cart-row');
      const cartItems = document.getElementsByClassName('cart-items')[0];
      const cartItemNames = cartItems.getElementsByClassName('cart-item-title');
      for (let i = 0; i < cartItemNames.length; i += 1) {
        if (cartItemNames[i].innerText === title) {
          Swal.fire('This item is already added to the cart');
          return;
        }
      }
      const cartRowContents = `
        <div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn-danger" type="button">REMOVE</button>
        </div>`;
      cartRow.innerHTML = cartRowContents;
      cartItems.append(cartRow);
      cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
      cartRow
        .getElementsByClassName('cart-quantity-input')[0]
        .addEventListener('change', quantityChanged);
      if (window.innerWidth > 800 && !isElementInViewport(checkoutButton)) {
        document.querySelector('.content-section').scrollIntoView();
      }
    }

    function addToCartClicked() {
      const title = `${this.parentElement.children[2].innerText}`;
      const price = `${this.parentElement.children[3].innerText}`;
      addItemToCart(title, price);
      updateCart();
    }

    function showModal() {
      fetch('/modal')
        .then(res => res.json())
        .then(data => {
          console.log(data.products);

          const title = `${this.parentElement.children[2].innerText}`;
          for (let i = 0; i < data.products.length; i += 1) {
            if (title === data.products[i].title) {
              Swal.fire(`${data.products[i].subtitle}`);
            }
          }
        });
    }

    function checkoutDbUpdate() {
      fetch('/products', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(cartContents),
      });
    }

    function checkoutClicked() {
      if (document.querySelector('.cart-total-price').innerText === '$0') {
        Swal.fire('There is nothing in the cart');
      } else {
        const paypalItems = cartContents.map(obj => {
          const paypalItem = {};
          paypalItem.name = obj.title;
          paypalItem.unit_amount = {
            currency_code: 'USD',
            value: obj.price,
          };
          paypalItem.quantity = obj.quantity;
          return paypalItem;
        });

        // beginning of paypal code with our additions

        paypal
          .Buttons({
            createOrder(data, actions) {
              return actions.order.create({
                purchase_units: [
                  {
                    description: 'Andrew Altman Merch',
                    amount: {
                      currency_code: 'USD',
                      value: cartTotal,
                      breakdown: {
                        item_total: {
                          currency_code: 'USD',
                          value: cartSubtotal,
                        },
                        shipping: {
                          currency_code: 'USD',
                          value: shipping,
                        },
                      },
                    },
                    items: paypalItems,
                  },
                ],
              });
            },
            onApprove(data, actions) {
              return actions.order
                .capture()
                .then(() => {
                  window.location.href = '/products/thanks';
                })
                .then(checkoutDbUpdate());
            },
          })
          .render('#paypal-button-container');

        // end of paypal code with our additions

        productsContainer.style.display = 'none';

        checkoutButton.style.display = 'none';

        keepShoppingButton.style.display = 'block';

        stickyCart.style.visibility = 'hidden';

        for (let i = 0; i < quantityInputs.length; i += 1) {
          quantityInputs[i].readOnly = 'readonly';
        }

        for (let i = 0; i < removeCartItemButtons.length; i += 1) {
          removeCartItemButtons[i].style.display = 'none';
        }

        paypalButtonContainer.scrollIntoView();
      }
    }

    function keepShoppingClicked() {
      productsContainer.style.display = 'flex';

      checkoutButton.style.display = 'block';

      keepShoppingButton.style.display = 'none';

      stickyCart.style.visibility = 'visible';

      for (let i = 0; i < removeCartItemButtons.length; i += 1) {
        removeCartItemButtons[i].style.display = 'block';
      }

      for (let i = 0; i < quantityInputs.length; i += 1) {
        quantityInputs[i].readOnly = '';
      }

      paypalButtonContainer.innerHTML = '';
    }

    for (let i = 0; i < removeCartItemButtons.length; i += 1) {
      removeCartItemButtons[i].addEventListener('click', removeCartItem);
    }

    for (let i = 0; i < quantityInputs.length; i += 1) {
      quantityInputs[i].addEventListener('change', quantityChanged);
    }

    for (let i = 0; i < addToCartButtons.length; i += 1) {
      addToCartButtons[i].addEventListener('click', addToCartClicked);
      if (addToCartButtons[i].innerText === 'Sold Out') {
        addToCartButtons[i].disabled = true;
      }
    }
    for (let i = 0; i < details.length; i += 1) {
      details[i].addEventListener('click', showModal);
    }

    gotoCartButton.addEventListener('click', gotoCartClicked);
    checkoutButton.addEventListener('click', checkoutClicked);
    keepShoppingButton.addEventListener('click', keepShoppingClicked);
    keepShoppingButton.style.display = 'none';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
