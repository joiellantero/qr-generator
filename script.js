let fqr = document.getElementById('fqr');
let qr = document.getElementById('qr');
let wrapper = document.querySelector(".wrapper");

fqr.addEventListener('submit', e => {
  e.preventDefault();

  // clear any existing QR and save button
  clearData();

  // obtain user input for url and size of the qr
  let url = e.target.elements.furl.value;
  let size = e.target.elements.fsize.value;

  // creating the div for the QR image 
  const qr_container = document.createElement('div');
  qr_container.id = "qr-img";
  document.getElementById('qr').appendChild(qr_container);

  // disable button and show loading text upon pressing generate button
  showLoading();

  setTimeout(() => {
    wrapper.classList.add("active");

    // return generate button to its original state
    hideLoading();

    // generate the QR using the url input by the user
    // it will always have 125 size
    generateQR(url, 125, document.getElementById("qr-img"));

    // generate the hidden QR to be used for downloading with the custom size from user input
    generateHiddenQR(url, size);

    // capture the image data generated for saving later
    setTimeout(() => {
      const url = document.querySelector("#qr-img-hidden img").src
      createDownloadBtn(url, size);
    }, 50);
  }, 1000);
});

const showLoading = () => {
  document.querySelector("#fqr button").disabled = true;
  document.querySelector("#fqr button").innerHTML = "<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading..."
};

const hideLoading = () => {
  document.querySelector("#fqr button").disabled = false;
  document.querySelector("#fqr button").innerHTML = 'Generate'
};

const generateQR = (url, size, container) => {
  new QRCode(container, {
    text: url,
    width: size,
    height: size,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
};

const createDownloadBtn = (url, size) => {
  const link = document.createElement('a');
  link.id = 'Download';
  link.classList = 'btn btn-light rounded-0';
  link.href = url
  link.download = 'image.png';
  link.innerHTML = `download <span>${size}x${size} PIXELS</span>`;

  document.getElementById('qr').appendChild(link);
};

const clearData = () => {
  wrapper.classList.remove("active");
  qr.innerHTML = '';
  const saveBtn = document.getElementById('save-link');
  if (saveBtn) {
    saveBtn.remove();
  }
};

const generateHiddenQR = (url, size) => {
  const qr_container = document.createElement('div');
  qr_container.id = "qr-img-hidden";
  qr_container.className = "visually-hidden";
  document.getElementById('qr').appendChild(qr_container);

  generateQR(url, size, document.getElementById("qr-img-hidden"));
};