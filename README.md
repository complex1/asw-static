# ASW-STAIC

Asw Static is use to Daynamicly, generate static html files.

## Setup

clone this Repo

```bash
 npm install
```

start working from src folder.

## how to use

all your pages are in ./src/pages folder in JS format.
Add all your static files in your ./src/static folder.
if you have some reusable component that is being use in multi components add them in components folder.

## How to write page componet.

Page component will export object that will containe mainly 3 section.

* params
* preprocessing
* render

```javascript
module.exports = {
  params: [], // array object params
  preprocessing: (params, render) => { 
    // Preprocessing called before render
    // Render aregument will be a function that use to run render function
    const data = {}
    render(data)
  },
  render: (data) => {
    // will return an Json object that will use to generate HTML document
    return {
      head: {
        title: '',
        childrens: []
      },
      body: {
        childrens: []
      }
    }
  }
}
```

### params section

params is use for paths which have some path parameters.
ex: we have list blogs and we want to generate static file for all ID.
then our paths will be like /blog/{blogId}
for that we our folder structure will be like that

```bash
 src
    pages
      blog
        _blogId.js
```

in that case param will be

```javascript
[
  {
    blogId: 'xxxx-xxxx-xxxx-xxxx1'
  },
  {
    blogId: 'xxxx-xxxx-xxxx-xxxx2'
  }
  ...
]
```

### preprocessing section

preprocessing use to called before the render function we pull all the required data which are being use in render.
it takes current object of param as an input argument.
Render aregument will be a function that use to run render function

### render section

It's a function that takes output of preprocessing as input argument.
and return json dom object
structure of return object is

```javascript
{
  head: {
    title: '',
    childrens: []
  }
  body: {
    childrens: []
  }
}
```

#### how to add tag

tag object

```javascript

{
  tag: "div", // name of tag
  content: "this is content", // text content inside tag
  attr: { // any attribute that needs to be added
    class: "class attribute",
    id: "id attribute"
    name: "name attribute"
    title: "title attribute"
    ...
  },
  childrens: [] // id attribute has children attribute
}

```
