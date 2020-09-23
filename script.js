const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent &&
               navigator.userAgent.indexOf('CriOS') == -1 &&
               navigator.userAgent.indexOf('FxiOS') == -1;

if (!isSafari) {
  document.documentElement.style.scrollBehavior = 'smooth'
}

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
    if (isSafari) spineDiv.style.display = 'block'

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

function getFilmObject (id) {
  const film = userData.films.filter(
    film => film.spine_id == id
  )[0]
  return film || false
}

function getFilmTitle (id) {
  const film = filmObjectArray.filter(
    film => +film.spine == id
  )[0]
  return film.title || false
}

function updateUserData (id, key, value) {
  const film = getFilmObject(id, userData.films)
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
//const notesWindow = document.querySelector('.window')



function loadNotesWindow () {
  event.stopPropagation()
  const spine = this.parentNode.children[1].innerText
  const currentFilmNotes = getFilmObject(spine, userData.films)
  
  
  const notesWindow = document.createElement('div')
  notesWindow.className = 'window'
  document.body.appendChild(notesWindow)

  const header = document.createElement('div')
  notesWindow.appendChild(header)
  header.className = 'header'

  const filmTitle = document.createElement('h1')
  header.appendChild(filmTitle)
  filmTitle.innerText = getFilmTitle(spine)

  

  const closeIcon = document.createElement('i')
  closeIcon.innerHTML = 'x'
  closeIcon.addEventListener('click', destroy)
  header.appendChild(closeIcon)
  
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


const searchBar = document.querySelector('#searchbar')

searchBar.addEventListener('change', updateSearch)


function updateSearch (e) {
  const input = e.target.value
  e.target.blur()
  e.target.addEventListener('click', search(input))
}

async function search (title) {
  const filmNumber = filmObjectArray.filter(
    film => film.title.toLowerCase().includes(title)
  ).map(film => film.spine)[0]

  for (const a of document.querySelectorAll(".grid-spine-item")) {
    if (a.innerText == filmNumber) {
    
      await scrollToTargetAdjusted(a)
      if (isSafari) {
        a.classList.add('pulse-safari')
      } else {
        a.classList.add('pulse')
      }
      setTimeout(async function(){ 
        await a.classList.remove('pulse')
        await a.classList.remove('pulse-safari')
        //a.style.border = '1px solid #201e1b'
      }, 2600)
      
    }
  }

  

  //console.log(filmNumber || false)
}

async function scrollToTargetAdjusted(element) {
  const headerOffset = 50
  const elementPosition = await element.getBoundingClientRect().top
  const offsetPosition = elementPosition - headerOffset + pageYOffset
  window.scrollTo({
    top: offsetPosition
  })
}
