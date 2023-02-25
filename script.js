let form = document.getElementById('fqr')
form.addEventListener('submit', e => {
  e.preventDefault()

  let url = e.target.elements.furl.value
  let size = e.target.elements.fsize.value

  console.log(url, size)

  new QRCode(document.getElementById("qrcode"), {
    text: url,
    width: size,
    height: size,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  })
})
