const fs = require('fs');
const gm = require('gm')
const cnv = require('canvas')

const express = require("express");
const multer  = require("multer");
  
const app = express();

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});
  
app.use(express.static(__dirname));
app.use(multer({storage:storageConfig}).single("filedata"));
app.post("/upload", function (req, res, next) {
   
    let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else{
		createImg(filedata.path);
    	const file = 'result.png'
		if (fs.existsSync(file)) {
	        res.download(file)
		} else {
			res.send('Ошибка сервера: файл не существует')
		}
    }
});

app.listen(3000);

function createImg(filePath){
	// let filePath = 'uploads/file.txt'
	let row
	let indexStart
	let color


	let dataString = fs.readFileSync(filePath).toString();

	let data = dataString.split('\n');
	let w = Number(data[0].split(',')[0]);
	let h = Number(data[0].split(',')[1]);



	let canvas = cnv.createCanvas(w, h)
	const ctx = canvas.getContext('2d')

	let imgData = ctx.createImageData(w, h)

	for(let i = 0; i < w; i++){
		row = data[i + 1].split(',')

		for(let j = 0; j < h; j++){
			indexStart = (i * w + j) * 4
			color = parseInt(row[j], 10).toString(16)
			for(let l = 0; l < 3; l++){
				imgData.data[indexStart + l] = color.substr(l * 2, 2)
			}
			imgData.data[indexStart + 3] = 128
		}
	}


	ctx.putImageData(imgData, 0, 0)
	id2 = ctx.getImageData(0, 0, w, h)
	console.log(id2)

	const buffer = canvas.toBuffer('image/png')
	fs.writeFileSync('./result.png', buffer)
}