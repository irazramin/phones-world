// variables
const searchBtn = document.getElementById('search-phone');
const searchInput = document.getElementById('search-input');
const phoneResult = document.getElementById('result-phones');
const loader = document.getElementById('loader');
const yourResultText = document.getElementById('your-result-text');
const phoneSpecification = document.getElementById('phone-specification');
const speciPhoneName = document.getElementById('speci-phone-name');
const speciImg = document.getElementById('speci-img');
const releaseDate = document.getElementById('release-date');
const speciBrandName = document.getElementById('speci-brand-name');
const storageText = document.getElementById('storage');
const displaySizeText = document.getElementById('display-size');
const chipSetText = document.getElementById('chip-set');
const memoryText = document.getElementById('memory');
const sensorsText = document.getElementById('sensors');
const wlan = document.getElementById('wlan');
const bluetooth = document.getElementById('bluetooth');
const gps = document.getElementById('gps');
const nfc = document.getElementById('nfc');
const radio = document.getElementById('radio');
const usb = document.getElementById('usb');
const loadMore = document.getElementById('load-more');
let allPhonesData = [];
// search event
searchBtn.addEventListener('click', () => {
  // when use search phone, specification section will hidden
  phoneSpecification.style.display = 'none';
  const searchValue = searchInput.value;
  getPhoneApi(searchValue.toLowerCase());
  phoneResult.textContent = '';
  allPhonesData.pop();
});

// fetch data for phone
const getPhoneApi = async (phone) => {
  loader.style.display = 'block';
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phones?search=${phone}`
    );
    const data = await res.json();
    const phoneData = data.data;
    allPhonesData[0] = phoneData;

    phoneResult.textContent = '';
    // if data less than 20 load more button won't show
    if (phoneData.length <= 20) {
      loadMore.style.display = 'none';
      setPhoneData(phoneData);
    } else {
      const phonesSliceData = phoneData.slice(0, 20);
      setPhoneData(phonesSliceData);
      loadMore.style.display = 'block';
    }
    loader.style.display = 'none';
  } catch (error) {
    console.log(error);
  }
};

// set data to card items
const setPhoneData = (phones) => {
  // if data size 0, its show error
  if (phones.length === 0) {
    yourResultText.innerText = `NO DATA FOUND`;
    yourResultText.style.display = 'block';
    yourResultText.style.color = 'red';
    
  } else {
    yourResultText.innerText = `Your results`;
    yourResultText.style.display = 'block';
    yourResultText.style.color = 'black';
  }
  loadMore.style.display = 'none';
  phones.forEach((phone, idx) => {
    // col create
    const col = document.createElement('div');
    col.className += 'col';

    // card create
    const card = document.createElement('div');
    card.className += 'card';
    card.style.width = '18rem';
    card.style.margin = '0 auto';

    // img create
    const img = document.createElement('img');
    img.className += 'card-img-top img-fluid w-75 mx-auto mt-2';
    img.src = phone.image;

    //img append to card
    card.appendChild(img);

    // card body create
    const cardBody = document.createElement('div');
    cardBody.className += 'card-body';
    cardBody.innerHTML = `
   <h5 id="phone-name" class="card-title">${phone.brand}</h5>
   <h6 class="card-text">
      Brand : <span id="brand-name">${phone.phone_name}</span>
   </h6>
    `;

    // button create
    const explorePhone = document.createElement('button');
    explorePhone.className += 'btn mt-3 me-auto explore-phone';
    explorePhone.innerText = 'Explore';
    explorePhone.style.backgroundColor = 'grey';
    explorePhone.style.color = 'white';
    cardBody.appendChild(explorePhone);

    // cardbody append to card
    card.appendChild(cardBody);

    // card append to col
    col.appendChild(card);

    // col append to parent
    phoneResult.appendChild(col);

    explorePhone.addEventListener('click', () => {
      getPhoneSpecificationData(phone.slug);
      window.scrollTo(0, 0);
    });
  });
};

// call api for specific data
const getPhoneSpecificationData = async (id) => {
  loader.style.display = 'block';
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phone/${id}`
    );
    const data = await res.json();
    setSpecificationData(data);
    loader.style.display = 'none';
  } catch (error) {
    loader.style.display = 'none';
    console.log(error);
  }
};

// set specific data
const setSpecificationData = (specification) => {
  phoneSpecification.style.display = 'block';
  const { storage, displaySize, chipSet, memory, sensors } =
    specification.data.mainFeatures;

  storageText.innerText = storage;
  displaySizeText.innerText = displaySize;
  chipSetText.innerText = chipSet;
  memoryText.innerText = memory;
  sensorsText.innerText = sensors;

  // sensors data checking ,if exits it will be add or show not found
  if (specification.data.others) {
    const { WLAN, Bluetooth, GPS, NFC, Radio, USB } = specification.data.others;

    wlan.innerText = WLAN;
    bluetooth.innerText = Bluetooth;
    gps.innerText = GPS;
    radio.innerText = Radio;
    nfc.innerText = NFC;
    usb.innerText = USB;
  } else {
    wlan.innerText = 'not found';
    bluetooth.innerText = 'not found';
    gps.innerText = 'not found';
    radio.innerText = 'not found';
    nfc.innerText = 'not found';
    usb.innerText = 'not found';
  }

  speciPhoneName.innerText = specification.data.name;
  speciBrandName.innerText = specification.data.brand;
  speciImg.src = specification.data.image;

  releaseDate.innerText = `${
    specification.data.releaseDate
      ? specification.data.releaseDate
      : 'release date not found'
  }`;
};

// load more data
loadMore.addEventListener('click', () => {
  const sliceData = allPhonesData[0].slice(20);
  setPhoneData(sliceData);
});
