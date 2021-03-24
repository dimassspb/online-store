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
const openModal = () => {
  modalCart.classList.add('show');
};

const closeModal = () => {
  modalCart.classList.remove('show');
};
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

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function () {
  const result = await fetch('db/db.json'); //server url
  if (!result.ok) {
    throw 'Ошибка:' + result.status;
  }
  return await result.json();
};

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

more.addEventListener('click', (event) => {
  event.preventDefault();
  getGoods().then(renderCards);
});

const filterCards = (field, value) => {
  getGoods()
    .then((data) => {
      const filteredGoods = data.filter((good) => {
        return good[field] === value;
      });
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

// All goods
navigationLink[5].addEventListener('click', (event) => {
  event.preventDefault();
  getGoods().then(renderCards);
});

// buttons

buttons = Array.from(document.getElementsByClassName('button-text'));
acessoriesButton = buttons[7];
clothesButton = buttons[8];

acessoriesButton.addEventListener('click', (event) => {
  getGoods()
    .then((data) => {
      const filteredGoods = data.filter((good) => {
        return good.category === 'Accessories';
      });
      return filteredGoods;
    })
    .then(renderCards);
});

clothesButton.addEventListener('click', (event) => {
  getGoods()
    .then((data) => {
      const filteredGoods = data.filter((good) => {
        return good.category === 'Clothing';
      });
      return filteredGoods;
    })
    .then(renderCards);
});
