let fqr = document.getElementById('fqr')
let fdowload = document.getElementById('fdownload')

fqr.addEventListener('submit', e => {
  e.preventDefault()

  let url = e.target.elements.furl.value

  console.log(url)

  let wrapper = document.querySelector(".wrapper")
  wrapper.classList.add("active");

  new QRCode(document.querySelector("#qrimg"), {
    text: url,
    width: 125,
    height: 125,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  })
})

fdownload.addEventListener('submit', e => {
  e.preventDefault()

  let size = e.target.elements.fsize.value

  console.log("download at size:", size, "x", size)
})
