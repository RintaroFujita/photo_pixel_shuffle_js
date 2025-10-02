
    // 元の画像データを保存する変数
    var originalImageData = null;

    function onLoadImage(event) {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      var shuffleButton = document.getElementById('shuffleButton');
      
      img.onload = function() {
        // キャンバスサイズを画像に合わせて設定
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // 元の画像データを保存
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // ボタンを有効化
        shuffleButton.disabled = false;
        var destroyButton = document.getElementById('destroyButton');
        destroyButton.disabled = false;
        var saveButton = document.getElementById('saveButton');
        saveButton.disabled = false;
        var resetButton = document.getElementById('resetButton');
        resetButton.disabled = false;
      }
      
      if (event.target.files && event.target.files[0]) {
        img.src = URL.createObjectURL(event.target.files[0]);
      }
    }


    function onShuffleButtonClick() {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      var blockSizeSlider = document.getElementById('blockSize');
      var blockSize = parseInt(blockSizeSlider.value);
      
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // より強いシャッフル効果のための追加処理
      if (blockSize > 50) {
        // 非常に強いシャッフル効果
        extremeShufflePixels(imageData, blockSize);
      } else {
        shuffleImagePixels(imageData, blockSize);
      }
      
      ctx.putImageData(imageData, 0, 0);
    }

    function onDestroyButtonClick() {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      var destroyIntensitySlider = document.getElementById('destroyIntensity');
      var destroyIntensity = parseInt(destroyIntensitySlider.value);
      
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imageData = destroyImagePixels(imageData, destroyIntensity);
      ctx.putImageData(imageData, 0, 0);
    }

    function onSaveButtonClick() {
      var canvas = document.getElementById('canvas');
      
      // キャンバスを画像として保存
      var link = document.createElement('a');
      link.download = 'processed_image_' + new Date().getTime() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    function onResetButtonClick() {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      
      // 元の画像データを復元
      if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
      }
    }


    function shuffleImagePixels(imageData, blockSize) {
      var pixels = imageData.data;
      var width = imageData.width;
      var height = imageData.height;
      
      // より強いシャッフル効果のための改善されたアルゴリズム
      var shuffleRounds = Math.max(1, Math.floor(blockSize / 10)); // ブロックサイズに応じてシャッフル回数を調整
      
      for (var round = 0; round < shuffleRounds; round++) {
        // ブロックサイズに基づいてピクセルをシャッフル
        for (var y = 0; y < height; y += blockSize) {
          for (var x = 0; x < width; x += blockSize) {
            // 現在のブロック内でランダムにピクセルを選択
            var randomX = x + Math.floor(Math.random() * Math.min(blockSize, width - x));
            var randomY = y + Math.floor(Math.random() * Math.min(blockSize, height - y));
            
            // 現在のピクセルとランダムピクセルのRGBA値を交換
            var currentIndex = (y * width + x) * 4;
            var randomIndex = (randomY * width + randomX) * 4;
            
            // RGBAの各値を交換
            for (var i = 0; i < 4; i++) {
              var temp = pixels[currentIndex + i];
              pixels[currentIndex + i] = pixels[randomIndex + i];
              pixels[randomIndex + i] = temp;
            }
          }
        }
        
        // より強いシャッフル効果のため、追加のランダムシャッフル
        if (blockSize > 20) {
          for (var i = 0; i < pixels.length; i += 4) {
            if (Math.random() < 0.1) { // 10%の確率でランダムシャッフル
              var randomIndex = Math.floor(Math.random() * (pixels.length / 4)) * 4;
              for (var j = 0; j < 4; j++) {
                var temp = pixels[i + j];
                pixels[i + j] = pixels[randomIndex + j];
                pixels[randomIndex + j] = temp;
              }
            }
          }
        }
      }
    }

    // 極端なシャッフル効果
    function extremeShufflePixels(imageData, blockSize) {
      var pixels = imageData.data;
      var width = imageData.width;
      var height = imageData.height;
      
      // 複数回のシャッフルを実行
      var shuffleRounds = Math.floor(blockSize / 20) + 2;
      
      for (var round = 0; round < shuffleRounds; round++) {
        // ランダムな位置でピクセルをシャッフル
        for (var i = 0; i < pixels.length; i += 4) {
          if (Math.random() < 0.3) { // 30%の確率でシャッフル
            var randomIndex = Math.floor(Math.random() * (pixels.length / 4)) * 4;
            for (var j = 0; j < 4; j++) {
              var temp = pixels[i + j];
              pixels[i + j] = pixels[randomIndex + j];
              pixels[randomIndex + j] = temp;
            }
          }
        }
        
        // ブロックベースのシャッフルも実行
        for (var y = 0; y < height; y += Math.max(1, Math.floor(blockSize / 2))) {
          for (var x = 0; x < width; x += Math.max(1, Math.floor(blockSize / 2))) {
            var randomX = Math.floor(Math.random() * width);
            var randomY = Math.floor(Math.random() * height);
            
            var currentIndex = (y * width + x) * 4;
            var randomIndex = (randomY * width + randomX) * 4;
            
            for (var k = 0; k < 4; k++) {
              var temp = pixels[currentIndex + k];
              pixels[currentIndex + k] = pixels[randomIndex + k];
              pixels[randomIndex + k] = temp;
            }
          }
        }
      }
    }

    // 画像破壊機能
    function destroyImagePixels(imageData, intensity) {
      var pixels = imageData.data;
      var numPixels = pixels.length;
      
      // 強度を0-1の範囲に変換
      var intensityRatio = intensity / 100;
      
      // 破壊されるピクセルの割合を計算
      var randomColorRatio = intensityRatio * 0.7; // 強度の70%をランダム色に
      var grayscaleRatio = intensityRatio * 0.2;    // 強度の20%をグレースケールに
      var keepRatio = 1 - intensityRatio;          // 残りを元の色に

      for (var i = 0; i < numPixels; i += 4) {
        var randomNumber = Math.random();
        if (randomNumber < randomColorRatio) {
          // ランダムな色に変更
          pixels[i] = Math.floor(Math.random() * 256);     // Red
          pixels[i + 1] = Math.floor(Math.random() * 256); // Green
          pixels[i + 2] = Math.floor(Math.random() * 256); // Blue
        }
        else if (randomNumber < randomColorRatio + grayscaleRatio) {
          // グレースケールに変更
          var color = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          pixels[i] = color;     // Red
          pixels[i + 1] = color; // Green
          pixels[i + 2] = color; // Blue
        }
        // 残りは元の色を保持
        
        pixels[i + 3] = 255; // Alpha値を255に設定
      }

      return imageData;
    }
    

    // スライダーの値表示を更新する関数
    function updateBlockSizeDisplay() {
      var blockSizeSlider = document.getElementById('blockSize');
      var blockSizeValue = document.getElementById('blockSizeValue');
      blockSizeValue.textContent = blockSizeSlider.value;
    }

    function updateDestroyIntensityDisplay() {
      var destroyIntensitySlider = document.getElementById('destroyIntensity');
      var destroyIntensityValue = document.getElementById('destroyIntensityValue');
      destroyIntensityValue.textContent = destroyIntensitySlider.value + '%';
    }

    // イベントリスナーの設定
    var imageFileInput = document.getElementById('imageFile');
    imageFileInput.addEventListener('change', onLoadImage);
    
    var shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', onShuffleButtonClick);
    
    var destroyButton = document.getElementById('destroyButton');
    destroyButton.addEventListener('click', onDestroyButtonClick);
    
    var saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', onSaveButtonClick);
    
    var resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', onResetButtonClick);
    
    var blockSizeSlider = document.getElementById('blockSize');
    blockSizeSlider.addEventListener('input', updateBlockSizeDisplay);
    
    var destroyIntensitySlider = document.getElementById('destroyIntensity');
    destroyIntensitySlider.addEventListener('input', updateDestroyIntensityDisplay);
    
    // 初期表示を設定
    updateBlockSizeDisplay();
    updateDestroyIntensityDisplay();