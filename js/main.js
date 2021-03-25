const mySwiper = new Swiper('.swiper-container', {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: '.slider-button-next',
    prevEl: '.slider-button-prev',
  },
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll(
  '.navigation-link:not(.view-all)',
);
const longGoodsList = document.querySelector('.long-goods-list');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.cart-table__total');

const getGoods = async () => {
  const result = await fetch('db/db.json'); //server url
  if (!result.ok) {
    throw 'Ошибка:' + result.status;
  }
  return await result.json();
};

const cart = {
  cartGoods: [],
  renderCart() {
    cartTableGoods.textContent = '';
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement('tr');
      trGood.className = 'cart-item';
      trGood.dataset.id = id;
      trGood.innerHTML = `
      <td>${name}</td>
					<td>${price}</td>
					<td><button class="cart-btn-minus" data-id="${id}">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus" data-id="${id}">+</button></td>
					<td>${price * count}</td>
					<td><button class="cart-btn-delete" data-id="${id}">x</button></td>
      `;
      cartTableGoods.append(trGood);
    });

    // Домашнее задание
console.log(this.cartGoods);
    counter = document.querySelector('.cart-count');
    const goodsCounter = this.cartGoods.reduce((sum, item) => sum + item.count, 0);
    counter.textContent = goodsCounter;
    //
    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
    cartTableTotal.textContent = totalPrice + '$';
  },
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter((item) => id !== item.id);
    this.renderCart();
  },
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count--;
        }
        break;
      }
    }
    this.renderCart();
  },
  plusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count++;
        break;
      }
    }
    this.renderCart();
  },
  addCardGoods(id) {
    const goodItem = this.cartGoods.find((item) => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
        .then((data) => data.find((item) => item.id === id))
        .then(({ id, name, price }) => {
          this.cartGoods.push({
            id,
            name,
            price,
            count: 1,
          });
        });
    }

  },
};


document.body.addEventListener('click', (event) => {
  const addToCart = event.target.closest('.add-to-cart');
  if (addToCart) {
    cart.addCardGoods(addToCart.dataset.id);

  }
});

cartTableGoods.addEventListener('click', (event) => {
  const target = event.target;
  if (target.tagName === 'BUTTON') {
    const id = target.closest('.cart-item').dataset.id;

    if (target.classList.contains('cart-btn-delete')) {
      cart.deleteGood(id);
    }

    if (target.classList.contains('cart-btn-minus')) {
      cart.minusGood(id);
    }

    if (target.classList.contains('cart-btn-plus')) {
      cart.plusGood(id);
    }
  }
});

const openModal = () => {
  cart.renderCart();
  modalCart.classList.add('show');
};

const closeModal = () => modalCart.classList.remove('show');

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalCart.addEventListener('click', (event) => {
  const target = event.target;
  if (
    target.classList.contains('overlay') ||
    target.classList.contains('modal-close')
  ) {
    closeModal();
  }
});

// scroll smooth

const smoothScroll = () => {
  const scrollLinks = document.querySelectorAll('a.scroll-link');

  for (scrollLink of scrollLinks) {
    scrollLink.addEventListener('click', (event) => {
      event.preventDefault();
      const id = scrollLink.getAttribute('href');
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }
};
smoothScroll();

// goods

const createCard = (objCard) => {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-sm-6';

  const { label, name, img, description, id, price } = objCard; // деструктуризация

  card.innerHTML = `
  <div class="goods-card">
  ${label ? `<span class="label">${label}</span>` : ``}
						
            <img src="db/${img}" alt="${name}"
            class="goods-image">
						<h3 class="goods-title">E${name}</h3>
						<p class="goods-description">${description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${id}">
							<span class="button-price">$${price}</span>
						</button>
					</div>
  `;
  return card;
};

const renderCards = (data) => {
  longGoodsList.textContent = '';
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add('show-goods');
};

const showAll = (event) => {
  event.preventDefault();
  getGoods().then(renderCards);
};

viewAll.forEach((elem) => {
  elem.addEventListener('click', showAll);
});

const filterCards = (field, value) => {
  getGoods()
    .then((data) => {
      const filteredGoods = data.filter((good) => good[field] === value);
      return filteredGoods;
    })
    .then(renderCards);
};

navigationLink.forEach((el) => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    const field = el.dataset.field;
    const value = el.textContent;
    filterCards(field, value);
  });
});

const showAccessories = document.querySelectorAll('.show-accessories');
const showClothing = document.querySelectorAll('.show-clothing');

showAccessories.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    filterCards('category', 'Accessories');
  });
});
showClothing.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    filterCards('category', 'Clothing');
  });
});

// Домашнее задание Очистка корзины кнопкой

const deleteCart = addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('modal-my-own-button')) {
    cart.cartGoods = [];
  }
  cart.renderCart();
});

//


