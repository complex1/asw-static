const fs = require('fs')
const path = require('path')

const uid = () => Math.random().toString(36).substr(2, 9);

const getFileData = (filePath, cb) => {
  fs.readFile(filePath, (err, data) => {
    if (!err) {
      try {
        cb && cb(JSON.parse(data))
      } catch {
        cb && cb({})
      }
    } else {
      cb && cb({})
    }
  })
}

module.exports = class FileDB {
  constructor (db_name) {
    this.db_name = db_name
    this.db_path = path.join(__dirname, 'db' , `${db_name}.json`)
    fs.readFile(this.db_path, (err, data) => {
      if (err) {
        fs.writeFile(this.db_path, '{}', (err) => {
          console.log(err)
        })
      }
    })
  }

  set (obj, cb) {
    const id = obj.id || uid()
    obj.id = id
    getFileData(this.db_path, (data) => {
      data[id] = obj
      fs.writeFile(this.db_path, JSON.stringify(data, null, 2), (err) => {
        if (!err) {
          cb && cb(obj)
        }
      })
    })
  }

  deleteById (id, cb) {
    getFileData(this.db_path, data => {
      delete data[id]
      fs.writeFile(this.db_path, JSON.stringify(data, null, 2), (err) => {
        if (!err) {
          cb && cb(true)
        }
      })
    })
  }

  getById (id, cb) {
    getFileData(this.db_path, (data) => {
      cb && cb(data[id] || null)
    })
  }
  
  getAll (cb) {
    getFileData(this.db_path, data => {
      cb && cb(data)
    })
  }
}
