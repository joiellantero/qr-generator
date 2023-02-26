let fqr = document.getElementById('fqr');
let fdowload = document.getElementById('fdownload');
let qr = document.getElementById('qr')

fqr.addEventListener('submit', e => {
  e.preventDefault();

  clearUI();

  let url = e.target.elements.furl.value;
  let size = e.target.elements.fsize.value;

  let wrapper = document.querySelector(".wrapper");
  wrapper.classList.add("active");

  const qrimg = document.createElement('div');
  qrimg.id = "qr-img";
  document.getElementById('qr').appendChild(qrimg);

  generateQR(url)
  setTimeout(() => {
    const url = document.querySelector("#qr-img img").src
    createDownloadBtn(url, size);
  }, 50);
});

const generateQR = (url) => {
  new QRCode(document.getElementById("qr-img"), {
    text: url,
    width: 125,
    height: 125,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
};

const createDownloadBtn = (url, size) => {
  const link = document.createElement('a');
  link.id = 'save-img';
  link.classList = 'btn btn-primary';
  link.href = url
  link.download = 'image.png';
  link.innerHTML = 'Save Image';

  document.getElementById('qr').appendChild(link);
};

const clearUI = () => {
  qr.innerHTML = '';
  const saveBtn = document.getElementById('save-link');
  if (saveBtn) {
    saveBtn.remove();
  }
};