// const multer = require('multer')

// const storage = multer.diskStorage({
//     destination : (req,file,callback) => {
//         console.log('Saving file to uploads folder...');
//         callback(null,'./uploads')
//     },
//     filename : (req,file,callback) => {
//         const filename = `image-${Date.now()}-${file.originalname}`
//         console.log(`Generated filename: ${filename}`);
//         callback(null,filename)
//     }
// })

// const fileFilter = (req,file,callback) => {
//     if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
//         console.log('File accepted:', file.originalname);
//         callback(null,true)
//     }else{
//         console.log('File rejected:', file.originalname);
//         callback(null,false)
//         return callback(new Error("Please Upload file with following extensions (png,jpg,jpeg) only"))
//     }
// }

// const multerConfig = multer({
//     storage,fileFilter
// })

// module.exports = multerConfig






















const multer = require('multer')

const storage = multer.diskStorage({
    destination : (req,file,callback) => {
        console.log('Saving file to uploads folder...');
        callback(null,'./uploads')
    },
    filename : (req,file,callback) => {
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null,filename)
    }
})

const fileFilter = (req,file,callback) => {
    if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
        callback(null,true)
    }else{
        callback(null,false)
        return callback(new Error("Please Upload file with following extensions (png,jpg,jpeg) only"))
    }
}

const multerConfig = multer({
    storage,fileFilter
})

module.exports = multerConfig

