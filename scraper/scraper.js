const fs = require('fs')
const puppeteer = require('puppeteer')

const rawdata = fs.readFileSync('data.json')
const urlList = JSON.parse(rawdata)

const results = []

async function scrapeFilm (url, page) {
  const filmObject = {}

  await page.goto(url, { waitUntil: 'load', timeout: 0 })

  filmObject.imageUrl = await page.evaluate(
    () => document.querySelector(
      '.product-box-art img'
    ).src
  )

  filmObject.title = await page.evaluate(
    () => document.querySelector(
      '.header__primarytitle'
    ).innerText
  )

  filmObject.spine = await page.evaluate(
    () => {
      const regex = /\d+$/
      const spineElement = document.querySelector(
        '.film-meta-list li:last-child'
      )
      if (spineElement) {
        return +(spineElement.innerText.match(regex))
      } else return 0
    }
  )

  results.push(filmObject)

  console.log(filmObject.spine)
}

async function writeFilmObjectArray (array) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    for (const url of array) {
      await scrapeFilm(url, page)
    } 
  } catch (error) {
    console.log(error)
  } finally {
    await browser.close()
    const data = JSON.stringify(results)
    fs.writeFileSync('film-object-array.json', data)
  }
}

writeFilmObjectArray(urlList)
