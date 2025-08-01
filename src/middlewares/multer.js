import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp')
  },
  filename: function (req, file, cb) {
   
    cb(null, this.filename)
  }
})


 






export const upload = multer({ 
  storage 
})


// fields should be an array of objects with name and optionally a maxCount. Example:

// destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system’s default directory for temporary files is used.

