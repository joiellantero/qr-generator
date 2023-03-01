let fqr = document.getElementById('fqr');
let qr = document.getElementById('qr');
let wrapper = document.querySelector(".wrapper");
let ftheme = document.getElementById('ftheme');
let theme_value = 'none';
let isThemeActive = false;

fqr.addEventListener('submit', e => {
  e.preventDefault();

  // clear any existing QR and save button
  clearData();

  // obtain user input for url and size of the qr
  let url = e.target.elements.furl.value;
  let size = e.target.elements.fsize.value;
  let colordark = e.target.elements.fcolordark.value
  let colorlight = e.target.elements.fcolorlight.value

  // disable button and show loading text upon pressing generate button
  showLoading();

  setTimeout(() => {
    wrapper.classList.add("active");

    // return generate button to its original state
    hideLoading();

    // creating the div for the QR image 
    const qr_container = document.createElement('div');
    qr_container.id = "qr-img";
    qr.appendChild(qr_container);

    // generate the QR using the url input by the user
    // it will always have 128 size
    // dont display if there is a theme because we will display a different image
    if (!isThemeActive) generateQR(url, 128, colordark, colorlight, qr_container);

    // if the theme is active then we adjust the size of the hidden qr. 
    // this will be used for the qr size found in the theme
    if (isThemeActive) {
      size = 275;
    }

    // generate the hidden QR to be used for downloading with the custom size from user input
    generateHiddenQR(url, size, colordark, colorlight);

    // capture the image data generated for saving later
    setTimeout(() => {
      const src = document.querySelector("#qr-img-hidden img").src
      createDownloadBtn(src, size);
      if (isThemeActive) applyTheme(src);
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

const generateQR = (url, size, colordark, colorlight, container) => {
  new QRCode(container, {
    text: url,
    width: size,
    height: size,
    colorDark : colordark,
    colorLight : colorlight,
    correctLevel : QRCode.CorrectLevel.H
  });
};

const createDownloadBtn = (src, size) => {
  // the size variable is the size of the qr and not the image itself so if the theme is active we should get the size of the whole image
  if (isThemeActive) size = 256;

  const link = document.createElement('a');
  link.id = 'download';
  link.classList = 'btn btn-light rounded-0';
  link.href = src
  link.download = 'image.png';
  link.innerHTML = `<span>Download</span><span class="size">${size}x${size} PIXELS</span>`;

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

const generateHiddenQR = (url, size, colordark, colorlight) => {
  const qr_container = document.createElement('div');
  qr_container.id = "qr-img-hidden";
  qr_container.className = "visually-hidden";
  qr.appendChild(qr_container);

  generateQR(url, size, colordark, colorlight, document.getElementById("qr-img-hidden"));
};

const applyTheme = (qrimg) => {
  const theme_img = document.createElement('img');
  theme_img.id = 'qr-theme';
  theme_img.height = 128;
  theme_img.width = 128;
  document.getElementById('qr').appendChild(theme_img);

  let theme_src = `assets/templates/${theme_value}.png`;

  mergeImages([
    { src: theme_src}, 
    { src: qrimg, x: 155, y: 155}
  ])
  .then(b64 => document.getElementById('qr-theme').src = b64);
};

ftheme.addEventListener('change', () => {
  theme_value = ftheme.options[ftheme.selectedIndex].value;
  let fsize = document.getElementById("fsize");
  let fcolordark = document.getElementById("fcolordark");
  
  if (theme_value !== 'none'){
    fsize.disabled = true;
    fsize.value = 256;
    if (theme_value == 'candy') fcolordark.value = "#303C7E";
    if (theme_value == 'cherry') fcolordark.value = "#990112";
    if (theme_value == 'coffee') fcolordark.value = "#211E21";
    if (theme_value == 'forest') fcolordark.value = "#2F602D";
    if (theme_value == 'bee') fcolordark.value = "#000000";
    if (theme_value == 'warbler') fcolordark.value = "#234D6F";
    if (theme_value == 'orange') fcolordark.value = "#EE4E33";
    isThemeActive = true;
  } else {
    fsize.disabled = false;
    isThemeActive = false;
  }
});