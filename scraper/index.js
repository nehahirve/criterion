const fs = require('fs')
const puppeteer = require('puppeteer')

async function scrapeMainPage () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const url = 'https://www.criterion.com/shop/browse/list?sort=spine_number'
  await page.goto(url, { waitUntil: 'load', timeout: 0 })

  const filmUrls = await page.evaluate(
    () => Array.from(document.querySelectorAll('.gridFilm')).map(
      film => film.getAttribute('data-href')
    )
  )

  const data = JSON.stringify(filmUrls)
  fs.writeFileSync('data.json', data)
  await browser.close()
  console.log('JSON data is saved.')
}

scrapeMainPage()
