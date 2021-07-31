const helloWord = require('../components/helloWord')

module.exports = {
  params: [], // array object params
  preprocessing: (params, render) => { 
    // Preprocessing called before render
    // Render aregument will be a function that use to run render function
    render({
      title: "Hello ASW"
    })
  },
  render: (data) => {
    // will return an Json object that will use to generate HTML document
    return {
      head: {
        title: data.title,
        childrens: []
      },
      body: {
        tag: 'body',
        content: helloWord
      }
    }
  }
}