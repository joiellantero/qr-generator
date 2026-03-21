let fqr = document.getElementById('fqr');
let qr = document.getElementById('qr');
let wrapper = document.querySelector(".wrapper");
let ftheme = document.getElementById('ftheme');
let theme_value = 'none';
let isThemeActive = false;
let bgImageData = null;

// ── Background image upload ──
const fbgimage = document.getElementById('fbgimage');
const fileUploadArea = document.getElementById('file-upload-area');
const fileUploadText = document.getElementById('file-upload-text');
const fileUploadClear = document.getElementById('file-upload-clear');

fileUploadArea.addEventListener('click', () => fbgimage.click());

fileUploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
  fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', e => {
  e.preventDefault();
  fileUploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleBgImage(file);
});

fbgimage.addEventListener('change', () => {
  if (fbgimage.files[0]) handleBgImage(fbgimage.files[0]);
});

fileUploadClear.addEventListener('click', e => {
  e.stopPropagation();
  clearBgImage();
});

const handleBgImage = (file) => {
  const reader = new FileReader();
  reader.onload = e => {
    bgImageData = e.target.result;
    fileUploadText.textContent = file.name;
    fileUploadArea.classList.add('has-file');
    fileUploadClear.hidden = false;
    // Reset theme when using custom bg
    ftheme.value = 'none';
    theme_value = 'none';
    isThemeActive = false;
    document.getElementById('fsize').disabled = false;
  };
  reader.readAsDataURL(file);
};

const clearBgImage = () => {
  bgImageData = null;
  fbgimage.value = '';
  fileUploadText.textContent = 'Drop image or click to upload';
  fileUploadArea.classList.remove('has-file');
  fileUploadClear.hidden = true;
};

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
    // dont display if there is a theme or bg image because we will display a different image
    if (!isThemeActive && !bgImageData) generateQR(url, 128, colordark, colorlight, qr_container);

    // if the theme or bg image is active then we adjust the size of the hidden qr
    if (isThemeActive || bgImageData) {
      size = 275;
    }

    // generate the hidden QR to be used for downloading with the custom size from user input
    generateHiddenQR(url, size, colordark, colorlight);

    // capture the image data generated for saving later
    setTimeout(() => {
      let src = document.querySelector("#qr-img-hidden img").src
      if (isThemeActive) {
        applyTheme(src);
        setTimeout(() => {
          src = document.getElementById('qr-theme').src
          createDownloadBtn(src, size);
        }, 50);
      } else if (bgImageData) {
        applyBgImage(src, size);
        setTimeout(() => {
          src = document.getElementById('qr-bg-merged').src;
          createDownloadBtn(src, size);
        }, 100);
      } else {
        createDownloadBtn(src, size);
      }
    }, 50);
  }, 1000);
});

const showLoading = () => {
  document.querySelector(".btn-generate").disabled = true;
  document.querySelector(".btn-generate").innerHTML = "<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Loading..."
};

const hideLoading = () => {
  document.querySelector(".btn-generate").disabled = false;
  document.querySelector(".btn-generate").innerHTML = 'Generate'
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
  // the size variable is the size of the qr and not the image itself so if the theme or bg image is active we should get the size of the whole image
  if (isThemeActive || bgImageData) size = 256;

  const wrap = document.createElement('div');
  wrap.id = 'download-wrap';
  wrap.classList = 'download-gradient-wrap';

  const link = document.createElement('a');
  link.id = 'download';
  link.href = src;
  link.download = 'qrcode.png';
  const dlLabel = document.createElement('span');
  dlLabel.textContent = 'Download';
  const dlSize = document.createElement('span');
  dlSize.className = 'size';
  dlSize.textContent = `${size}x${size} PIXELS`;
  link.appendChild(dlLabel);
  link.appendChild(dlSize);

  wrap.appendChild(link);
  document.getElementById('qr').appendChild(wrap);
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
  .then(b64 => {
    document.getElementById('qr-theme').src = b64
  });
};

const applyBgImage = (qrSrc, size) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const bgImg = new Image();
  bgImg.onload = () => {
    canvas.width = bgImg.width;
    canvas.height = bgImg.height;
    ctx.drawImage(bgImg, 0, 0);

    const qrImg = new Image();
    qrImg.onload = () => {
      const qrSize = Math.min(bgImg.width, bgImg.height) * 0.4;
      const x = (bgImg.width - qrSize) / 2;
      const y = (bgImg.height - qrSize) / 2;
      ctx.drawImage(qrImg, x, y, qrSize, qrSize);

      const mergedImg = document.createElement('img');
      mergedImg.id = 'qr-bg-merged';
      mergedImg.src = canvas.toDataURL('image/png');
      mergedImg.style.maxWidth = '128px';
      mergedImg.style.maxHeight = '128px';
      document.getElementById('qr').appendChild(mergedImg);
    };
    qrImg.src = qrSrc;
  };
  bgImg.src = bgImageData;
};

ftheme.addEventListener('change', () => {
  theme_value = ftheme.options[ftheme.selectedIndex].value;
  let fsize = document.getElementById("fsize");
  let fcolordark = document.getElementById("fcolordark");
  
  if (theme_value !== 'none'){
    fsize.disabled = true;
    fsize.value = 256;
    clearBgImage();
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
    if (theme_value == 'none') fcolordark.value = "#000000";
  }
});