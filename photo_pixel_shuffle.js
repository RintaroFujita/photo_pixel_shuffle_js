
    function onLoadImage(event) {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function() {

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }
      img.src = URL.createObjectURL(event.target.files[0]);
    }


    function onShuffleButtonClick() {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var canvasWidth = 500; 
	var canvasHeight = 500; 
      shuffleImagePixels(imageData, 20); 
      ctx.putImageData(imageData, 0, 0);
    }


    function shuffleImagePixels(imageData, blockSize) {
      var pixels = imageData.data;
      for (var i = 0; i < pixels.length; i += 3) {
        var r = Math.floor(Math.random() * blockSize) * 3;
        var g = Math.floor(Math.random() * blockSize) * 3;
        var b = Math.floor(Math.random() * blockSize) * 3;
        var a = Math.floor(Math.random() * blockSize) * 3;

        var temp = pixels[i];
        pixels[i] = pixels[r];
        pixels[r] = temp;
        temp = pixels[i + 1];
        pixels[i + 1] = pixels[g + 1];
        pixels[g + 1] = temp;
        temp = pixels[i + 2];
        pixels[i + 2] = pixels[b + 2];
        pixels[b + 2] = temp;
        temp = pixels[i + 3];
        pixels[i + 3] = pixels[a + 3];
        pixels[a + 3] = temp;
      }
    }
    

    var imageFileInput = document.getElementById('imageFile');
    imageFileInput.addEventListener('change', onLoadImage);
    

    var shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', onShuffleButtonClick);