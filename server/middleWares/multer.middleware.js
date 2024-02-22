import path from "path";

import multer  from  'multer'
const upload = multer({ dest: 'uploads/',
limits: {fileSize:50*1024*1024},    //50 mb in size max limit
storage:multer.diskStorage({
    destination:"uploads/",      // hmara picture uploads file m store hone vala h
    filename:(_req , file,cb)=>{
        cb(null,file.originalname);  // file ka original jo name h usi name se yha p uploads file m store hone vali h
    },
}),
fileFilter:(_req,file,cb)=>{      
    let ext = path.extname(file.originalname);
// file k filtration ki konsa konsa file hum accept krenge avatr k pic m
    if(
        ext !== ".jpg" && 
        ext !== ".jpeg" && 
        ext !== ".webp" && 
        ext !== ".mp4"  
    ) {
        cb(new Error (`unsupported file type ! ${text}`),false);
        return;
    }
    cb(null,true);
},



});

export default upload;