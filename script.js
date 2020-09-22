const grid = document.getElementById('grid')
let userData

function initGridFromUserData (gridElement) {
  if (localStorage.getItem('userData')) {
    userData = JSON.parse(localStorage.getItem('userData'))
    userData.films = userData.films.filter(film => film.seen || film.notes)
  } else {
    userData = {
      films: []
    }
  }

  filmObjectArray = filmObjectArray.filter(item => item.spine !== 0)

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

    if (userData.films.length > 0) {
      for (const film of userData.films) {
        if (spine === +film.spine_id && film.seen) {
          image.style.opacity = '1'
        }
      }
    }

    const spineDiv = document.createElement('div')
    gridItem.appendChild(spineDiv)

    spineDiv.innerHTML = spine
    spineDiv.classList = 'grid-spine-item'

    const editIcon = document.createElement('button')
    gridItem.appendChild(editIcon)
    editIcon.innerText = '+'
    editIcon.addEventListener('click', loadNotesWindow)

    spineDiv.style.backgroundImage = `url(${imageUrl})`
    gridItem.addEventListener('click', clickHandler)
  }
}

initGridFromUserData(grid)
console.log(userData)

function clickHandler () {
  const imageDiv = this.children[0]
  const clickedFilmNumber = this.children[1].innerText
  if (imageDiv.style.opacity === '1') {
    imageDiv.style.opacity = '0'
    updateUserData(clickedFilmNumber, 'seen', false)
    writeDatatoLocalStorage(userData)
  } else {
    imageDiv.style.opacity = '1'
    updateUserData(clickedFilmNumber, 'seen', true)
    writeDatatoLocalStorage(userData)
  }
}

function promptNotes (filmnumber) {
  const notes = prompt('notes')
  updateUserData(filmnumber, 'notes', notes)
}

function getFilmOject (id) {
  const film = userData.films.filter(
    film => film.spine_id === id
  )[0]
  return film || false
}

function getFilmOjectFromSource (id) {
  const film = filmObjectArray.filter(
    film => +film.spine == id
  )[0]
  return film.title || false
}

function updateUserData (id, key, value) {
  const film = getFilmOject(id)
  if (!film) {
    const filmObject = {
      spine_id: id
    }
    userData.films.push(filmObject)
    filmObject[key] = value
  } else {
    film[key] = value
  }
}

function writeDatatoLocalStorage (data) {
  const JSONData = JSON.stringify(data)
  localStorage.setItem('userData', JSONData)
}


let mouseIsDown = false
let offset = [0, 0]
const notesWindow = document.querySelector('.window')

/*
notesWindow.addEventListener('mousedown', function (event) {
  offset = [
    notesWindow.offsetLeft - event.clientX,
    notesWindow.offsetTop - event.clientY
  ]
  mouseIsDown = true
})
*/







function loadNotesWindow () {
  event.stopPropagation()
  const spine = this.parentNode.children[1].innerText
  const currentFilmNotes = getFilmOject(spine)
  
  
  const notesWindow = document.createElement('div')
  notesWindow.className = 'window'
  document.body.appendChild(notesWindow)

  const filmTitle = document.createElement('h1')
  notesWindow.appendChild(filmTitle)
  filmTitle.innerText = getFilmOjectFromSource(spine)


  const closeIcon = document.createElement('i')
  closeIcon.innerHTML = 'x'
  closeIcon.addEventListener('click', destroy)
  notesWindow.appendChild(closeIcon)
  
  const saveButton = document.createElement('button')
  
  saveButton.setAttribute('id', 'save')
  saveButton.innerHTML = 'SAVE'

  const input = document.createElement('textarea')
  input.innerHTML = currentFilmNotes.notes || ''
  notesWindow.appendChild(input)
  notesWindow.appendChild(saveButton)
  input.addEventListener('change', updateNotes)
  
  notesWindow.addEventListener('mousedown', function (event) {
    offset = [
      notesWindow.offsetLeft - event.clientX,
      notesWindow.offsetTop - event.clientY
    ]
    mouseIsDown = true
  })

  document.addEventListener('mouseup', function () {
    mouseIsDown = false
  })

  document.addEventListener('mousemove', function (event) {
    event.preventDefault()
    if (mouseIsDown) {
      notesWindow.style.left = (event.clientX + offset[0]) + 'px'
      notesWindow.style.top = (event.clientY + offset[1]) + 'px'
    }
  })

  function updateNotes (e) {
    const input = e.target.value
    saveButton.addEventListener('click', saveNotes(input, spine))
  }

  function saveNotes (value, id) {
    updateUserData(id, 'notes', value)
    writeDatatoLocalStorage(userData)
    destroy()
  }

  function destroy () {
    document.body.removeChild(notesWindow)
  }

}




/*
***********************************************
DELETED CODE -- USED WHEN I USED COOKIES
***********************************************

let seenArray = []

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

***********************************************
END OF DELETED CODE -- USED WHEN I USED COOKIES
***********************************************
*/
