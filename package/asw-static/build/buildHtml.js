
const buildHtml = {}

const generateHead = (headObj) => {
  headObj = headObj || []
  let html = ""
  headObj.forEach(obj => {
    html += `<${obj.tag} `
    const attr = obj.attr || {}
    html += Object.keys(attr).reduce((acc, val) => acc += `${val}="${attr[val]}" `, '')
    html += '>'
    if (obj.content || obj.tag === 'script') {
      html += obj.content || ''
      html += `</${obj.tag}>`
    }
  })
  return html
}

const generateBody = (element) => {
  let html = ''
  html += `<${element.tag || 'div'} `
  const attr = element.attr || {}
  html += Object.keys(attr).reduce((acc, val) => acc += `${val}="${attr[val]}" `, '')
  if (element.childrens || element.content) {
    html += '>'
    html += element.content || ''
    element.childrens && element.childrens.forEach(child => html += generateBody(child))
    html += `</${element.tag || 'div'}>`
  } else {
    html += '/>'
  }
  return html
}

/**
 * 
 * @param {object} templete 
 */
buildHtml.build = function (templete, param, cb) {
  templete.preprocessing && templete.preprocessing(param, (templeteData) => {
    const templeteObj = templete.render(templeteData)
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${templeteObj.head ? templeteObj.head.title : ''}</title>
        ${templeteObj.head ? generateHead(templeteObj.head.childrens) : ''}
      </head>
      ${templeteObj.body ? generateBody(templeteObj.body) : ''}
    </html>
    `
    cb && cb(html)
  })
}

module.exports = buildHtml