import React from "react";

const PhotoCapture  = ( props ) => {

    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    var streaming = localStorage.getItem('cam'); //console.log(props);

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas'); console.log(canvas);
    var photo = document.getElementById('photo');
    var startbutton = document.getElementById('startbutton');
    var capturePictures = [];

    if (streaming) {
    height = video.videoHeight / (video.videoWidth/width);
    
    if (isNaN(height)) {
        height = width / (4/3);
    }
    
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    
    }

    startbutton.addEventListener('click', (ev) => {
    //   while(streaming) 
    //   {
    //       setTimeout(takepicture() , 60000);
    //       streaming = localStorage.getItem('cam');
          
    //   }
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  function convertURIToImageData(URI) {
    return new Promise(function(resolve, reject) {
      if (URI == null) return reject();
      var canvas = document.createElement('canvas'),
          context = canvas.getContext('2d'),
          image = new Image();
      image.addEventListener('load', function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      }, false);
      image.src = URI;
    });
  }
  
  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      console.log(canvas);
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    
    capturePictures.push(data);
    console.log(canvas);
    console.log(photo);
    convertURIToImageData( data ).then(function(imageData) {
        // Here you can use imageData
        console.log(imageData);
      });

    } else {
      clearphoto();
    }
  }

  return capturePictures;

}

export default PhotoCapture;