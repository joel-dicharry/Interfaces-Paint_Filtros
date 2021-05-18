document.addEventListener('DOMContentLoaded', () => {

    let canvas = document.querySelector("#canvas");
    let width = 600;
    let height = 500;
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle='white';
    ctx.fillRect(0,0, width, height);
    

    let inputImagen = document.querySelector("#upload");
    let btnGuardar = document.querySelector("#guardar");
    let btnRestaurar = document.querySelector("#restaurar");
    let lapiz = document.querySelector("#lapiz");
    let goma = document.querySelector("#goma");
    let limpiar = document.querySelector("#limpiar");
    let inputColor = document.querySelector("#colorSelect");
    let inputGrosor = document.querySelector("#grosor");
    let valueRange = document.querySelector("#valueRange");
    let color = inputColor.value;
    let grosor = inputGrosor.value;
    let dibujo=false, borrar=false;
    var x=0, y=0;
    let accion = null;
    let imagen = new Image();
    var imgOriginal;
    var nameImg;
    var selectedTool;

    inputImagen.addEventListener('change', abrir);
    inputImagen.addEventListener('click', () => inputImagen.value = "");
    btnGuardar.addEventListener('click', guardar);
    btnRestaurar.addEventListener('click', restaurar);

    inputColor.addEventListener('change', () => color = inputColor.value);
    
    inputGrosor.addEventListener('input', () => {
        grosor = inputGrosor.value;
        valueRange.innerHTML=grosor;
    });

    lapiz.addEventListener('click', (e) => {accion = "dibujo"; selectedTool=e.target.id});

    goma.addEventListener('click', (e) => {accion = "borrar"; selectedTool=e.target.id});

    canvas.addEventListener('mousedown', e => {
        if(!selectedTool){
            return;
        }
        
        if(accion === "dibujo"){
            // document.body.style.cursor = 'crosshair';
            dibujo = true;
            ctx.strokeStyle = color;
        } else if(accion === "borrar"){
            // document.body.style.cursor = 'not-allowed';
            borrar = true;
            ctx.strokeStyle = "white";
        }

        x = e.offsetX;
        y = e.offsetY;
        
        ctx.lineWidth = grosor;
        ctx.lineCap='round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x,y);
        ctx.stroke();
        canvas.addEventListener('mousemove', dibujar); 
        
    });

    canvas.addEventListener('mousemove', dibujar);

    canvas.addEventListener('mouseup', () => {
        // document.body.style.cursor = 'default';
        dibujo = false;
        borrar = false;
    });

    canvas.addEventListener("mouseout", ()=> {
        dibujo = false;
        borrar = false;
    });

    function limpiarCanvas() {
        canvas.width = canvas.width;
        ctx.fillStyle='white';
        ctx.fillRect(0,0, width, height);
        inputImagen.value = "";
        imgOriginal = "";
        nameImg = "";
    }
    limpiar.addEventListener('click', limpiarCanvas);

    function dibujar(e) {

        x = e.offsetX;
        y = e.offsetY

        if(dibujo === true) { //preguntar
            ctx.lineTo(x,y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        if(borrar === true) {
            ctx.lineTo(x,y);
            ctx.stroke();
            ctx.moveTo(x, y);
        }
    }

    // Posicion del mouse con desde el 0,0 del canvas
    // function oMousePos(canvas, e) {
    //     var ClientRect = canvas.getBoundingClientRect();
    //         return {
    //             x: Math.round(e.clientX - ClientRect.left),
    //             y: Math.round(e.clientY - ClientRect.top),
    //             x2: e.offsetX,
    //             y2: e.offsetY
    //     }
    // }


    function guardar() {
        let l = document.createElement('a');
        if(!nameImg){
            l.download = 'MyDraw.jpg';
        } else {
            l.download = nameImg;
        }
        l.href = canvas.toDataURL()
        l.click();
        l.delete;
    }

    function dibujarImg(){
        canvas.width = canvas.width;
        ctx.fillStyle='white';
        ctx.fillRect(0,0, width, height);
        let val = calculteAspectRatio(imagen);
        // console.log(val);
        xImg = val.x;
        yImg = val.y;
        wImg = val.newWidt;
        hImg = val.newHeight;
        ctx.drawImage(imagen, val.x, val.y, val.newWidth, val.newHeight);
        imgOriginal = imagen;
    }

    function abrir (e) {
        // debugger;
        if (e.target.files) {
            let imageFile = e.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            //guardo el nombre original de la imagen
            nameImg = imageFile.name;
            // console.log(imageFile.name);
            // console.log(nameImg);
            reader.onloadend = (e) => {
                imagen.src = e.target.result;
                imagen.onload = () => {
                    dibujarImg();
                    // inputImagen.value = "";
                }
            }
        }
    }
    
    function calculteAspectRatio(img) {
        let ww = img.width;
        let hh = img.height;

        // alto nuevo = (alto original * ancho nuevo) / ancho original

        let newWidth = canvas.width;
        let newHeight = canvas.height;
        let x = 0;
        let y = 0;


        //si la imagen es mas chica o  igual al canvas
        if(ww <= newWidth && hh <= newHeight) {
            newWidth = ww
            newHeight = hh;

        //si el ancho de la imagen es mayor al alto
        } else if(ww > hh){
            newHeight = parseInt((hh*newWidth)/ww);

        //si el alto de la imagen es mayor al ancho
        } else if(ww < hh){
            newWidth = parseInt((ww*newHeight)/hh);

        //si es una imagen cuadrada
        } else if(ww == hh) {
            newWidth = newHeight;
            newHeight = newHeight;
        }

        if(newWidth < canvas.width){
            x = parseInt((canvas.width - newWidth) / 2);
        }
        if(newHeight < canvas.height) {
            y = parseInt((canvas.height - newHeight) / 2);
        }


        return {
            newWidth, newHeight, x, y
        }
    }

    function restaurar() {
        // debugger;
        // if(!imgOriginal) return;
        // ctx.fillStyle='white';
        // ctx.fillRect(0,0, width, height);
        // // ctx.drawImage(imgOriginal, 0, 0, width, height);
        // ctx.drawImage(imgOriginal, xImg, yImg, wImg, hImg);
        // // ctx.putImageData(ctx.getImageData(0, 0, width, height),0,0);
        // // ctx.putImageData(ctx.getImageData(0, 0, width, height), width, height);
        dibujarImg();
    }


    ////////////////////////////////////////////////////////////////////////////



    let btnByn = document.querySelector("#byn");
    let btnNegativo = document.querySelector("#negativo");
    let btnBrilloMas = document.querySelector("#brilloMas");
    let btnBrilloMenos = document.querySelector("#brilloMenos");
    let btnBinar = document.querySelector("#binarizacion");
    let btnSepia = document.querySelector("#sepia");
    let btnSat = document.querySelector("#saturacion");
    let btnSuave = document.querySelector("#suavizado");
    var xImg = 0, yImg = 0, wImg = 0, hImg = 0;
    
    
    btnByn.addEventListener('click', e => filtro(e.target.name));
    btnNegativo.addEventListener('click', e => filtro(e.target.name));
    btnBrilloMas.addEventListener('click', e => filtro(e.target.name));
    btnBrilloMenos.addEventListener('click', e => filtro(e.target.name));
    btnBinar.addEventListener('click', e => filtro(e.target.name));
    btnSepia.addEventListener('click', e => filtro(e.target.name));
    btnSat.addEventListener('click', e => filtro(e.target.name));
    btnSuave.addEventListener('click', e => filtro(e.target.name));


    function filtro(filtro) {

        if(!imgOriginal) return;

        let imagenData = ctx.getImageData(xImg, yImg, imagen.width, imagen.height);
        let width = imagenData.width;
        let height = imagenData.height;

        if(filtro === "byn")
            byn(imagenData, width, height);
        if(filtro === "negativo")
            negativo(imagenData, width, height);
        if(filtro === "brilloMas")
            brilloMas(imagenData, width, height);
        if(filtro === "brilloMenos")
            brilloMenos(imagenData, width, height);
        if(filtro === "binarizacion")
            binarizacion(imagenData);
        if(filtro === "sepia")
            sepia(imagenData, width, height);
        if(filtro === "saturacion")
            saturacion(imagenData, width, height);
        if(filtro === "suavizado")
            suavizado(imagenData, width, height);

        ctx.putImageData(imagenData, xImg,yImg);
    }
    
    
    function byn(imageData,width,height) {
        console.log("func byn");
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let i = (y+x*height)*4;
                let valueGrey = (imageData.data[i + 0] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                imageData.data[i+0] = valueGrey;
                imageData.data[i+1] = valueGrey;
                imageData.data[i+2] = valueGrey;
            }
        }
    }

    function negativo(imageData,width,height) {
        console.log("func negativo");
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let i = (y+x*height)*4;
                let r = 255 - imageData.data[i+0];
                let g = 255 - imageData.data[i+1];
                let b = 255 - imageData.data[i+2];
                imageData.data[i+0] = r;
                imageData.data[i+1] = g;
                imageData.data[i+2] = b;
            }
        }
    }

    function brilloMas(imageData,width,height){
        console.log("func brillo +");
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let i = (y+x*height)*4;
                imageData.data[i+0] += 5;
                imageData.data[i+1] += 5;
                imageData.data[i+2] += 5;
            }
        }
    }
    function brilloMenos(imageData,width,height){
        console.log("func brillo -");
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let i = (y+x*height)*4;
                imageData.data[i+0] -= 5;
                imageData.data[i+1] -= 5;
                imageData.data[i+2] -= 5;
            }
        }
    }

    function binarizacion(imageData){
        console.log("func binarizacion");

        let threshold = 255/2;
        
        for (var i = 0; i < imageData.data.length; i+=4) {

            let value = (imageData.data[i + 0] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;

            if(value < threshold){
                imageData.data[i + 0] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
            }
            if (value >= threshold){
                imageData.data[i + 0] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 255;
            }
        }
        
    }

    function sepia(imageData,width,height){
        console.log("func sepia");
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++){
                let i = (y+x*height)*4;
                let r = imageData.data[i+0];
                let g = imageData.data[i+1];
                let b = imageData.data[i+2];
                // Red = (r * .393) + (g * .769) + (b * .189)
                // Green = (r * .349) + (g * .686) + (b * .168)
                // Blue = (r * .272) + (g * .534) + (b * .131)
                imageData.data[i+0] = (r * .393) + (g * .769) + (b * .189);
                imageData.data[i+1] = (r * .349) + (g * .686) + (b * .168);
                imageData.data[i+2] = (r * .272) + (g * .534) + (b * .131);
            }
        }
    }

    function saturacion(imageData,width,height){
        console.log("func saturacion");

        for (let i = 0; i < imageData.data.length; i+=4) {
            
            let r = imageData.data[i+0];
            let g = imageData.data[i+1];
            let b = imageData.data[i+2];

            let hsl = rgbToHsl(r, g, b);
            hsl[1] += hsl[1] + .2;
            let rgb = hslToRgb(hsl[0], hsl[1], hsl[2])

            imageData.data[i+0] = rgb[0];
            imageData.data[i+1] = rgb[1];
            imageData.data[i+2] = rgb[2];
        }
    }

    function suavizado(imageData,width,height){
        console.log("func suavizado");
    }


    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
    
        if (max == min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
    
        return [h, s, l];
    }

    function hslToRgb(h, s, l) {
        var r, g, b;
    
        if (s == 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
    
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
});
