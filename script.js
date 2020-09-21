const grid = document.getElementById('grid')
let seenArray = []

filmObjectArray = filmObjectArray.filter(item => item.spine !== 0)

let userData = {
  films: []
}

function searchCookiesAndUpdateSeenList () {
  let array = document.cookie.split(';')
    .filter(item => item.includes('film'))
  if (!(array[0])) {
    seenArray = []
  } else {
    array = array[0].split('=')[1]
    seenArray = JSON.parse(array)
  }
}

searchCookiesAndUpdateSeenList()

function init () {
  if (localStorage.getItem('userData')) {
    userData = JSON.parse(localStorage.getItem('userData'))
  } else {
    userData = {
      films: []
    }
  }
  console.log(userData)
}

init ()


for (const film of filmObjectArray) {
  const imageUrl = film.imageUrl
  const spine = film.spine

  const gridItem = document.createElement('div')
  grid.appendChild(gridItem)
  gridItem.classList = 'grid-item'

  const image = document.createElement('img')
  gridItem.appendChild(image)
  image.src = imageUrl
  image.classList = 'grid-image'
  if (seenArray.includes(spine.toString())) {
    image.style.opacity = '1'
  }

  const spineDiv = document.createElement('div')
  gridItem.appendChild(spineDiv)

  spineDiv.innerHTML = spine
  spineDiv.classList = 'grid-spine-item'

  spineDiv.style.backgroundImage = `url(${imageUrl})`
  gridItem.addEventListener('click', clickHandler)
}

function clickHandler () {
  const imageDiv = this.children[0]
  const clickedFilmNumber = this.children[1].innerText
  if (imageDiv.style.opacity === '1') {
    imageDiv.style.opacity = '0'
    removeFilmFromArray(seenArray, clickedFilmNumber)
    updateUserData(clickedFilmNumber, false)
    writeDatatoLocalStorage(userData)
    updateCookie(seenArray)
  } else {
    imageDiv.style.opacity = '1'
    addFilmToArray(seenArray, clickedFilmNumber)
    updateUserData(clickedFilmNumber, true)
    writeDatatoLocalStorage(userData)
    updateCookie(seenArray)
  }
}

function createTopLeftEditButton () {
  const edit = document.createElement('button')
  this.parentNode.appendChild(edit)
  edit.style.zIndex = '1000'
}

function removeFilmFromArray (array, filmnumber) {
  seenArray = array.filter(item => item !== filmnumber)
}

function addFilmToArray (array, filmnumber) {
  array.push(filmnumber)
}

function updateCookie (array) {
  const cookie = JSON.stringify(array)
  document.cookie = `films=${cookie}`
}

function updateUserData (spinenumber, boolean) {
  let userFilms = userData.films
  if (userFilms.length === 0) {
    userFilms.push({
      spine_id: spinenumber,
      seen: boolean
    })
  } else {
    for (const film of userFilms) {
      if (film.spine_id === spinenumber) {
        film.seen = boolean
        return
      }
    }
    userFilms.push({
      spine_id: spinenumber,
      seen: boolean
    })
  }
  //console.log(userData)
}

function writeDatatoLocalStorage (data) {
  const JSONData = JSON.stringify(data)
  localStorage.setItem('userData', JSONData)
}