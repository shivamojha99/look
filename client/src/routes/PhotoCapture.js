
const PhotoCapture  = ( props ) => {

    var width = 500;    // We will scale the photo width to this
    var height = 500;     // This will be computed based on the input stream

    var streaming = localStorage.getItem('cam');  //console.log(streaming);

    var userVideo = document.getElementById('video');
    var partnerVideo = document.getElementById('partnerVideo');
    var canvas = document.getElementById('canvas'); //console.log(canvas);
    var partnerCanvas = document.getElementById('partnerCanvas');
    var photo = document.getElementById('photo');
    var startbutton = document.getElementById('startbutton');
    var capturePictures = [];

    if (streaming && !( userVideo == null) ) {
    // height = userVideo.videoHeight / (userVideo.videoWidth/width);
    
    // if (isNaN(height)) {
    //     height = width / (4/3);
    // }
    
    // userVideo.setAttribute('width', width);
    // userVideo.setAttribute('height', height);
    // if( ! partnerVideo === null )
    // {
    //   partnerVideo.setAttribute('height', height);
    //   // partnerVideo.setAttribute('width', width);
    // }
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    partnerCanvas.setAttribute('width', width);
    partnerCanvas.setAttribute('height', height);
    
    }

    // startbutton.addEventListener('click', (ev) => {
    //   takepicture();
    //   ev.preventDefault();
    // }, false);
    if( !( userVideo === null ))
    clearphoto();

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    // photo.setAttribute('src', data);

    var context1 = partnerCanvas.getContext('2d');
    context1.fillStyle = "#AAA";
    context1.fillRect(0, 0, canvas.width, canvas.height);

    // var data = partnerCanvas.toDataURL('image/png');

    takepicture()
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
    var context1 = partnerCanvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(userVideo, 0, 0, width, height);
      // console.log(canvas);
      var data = canvas.toDataURL('image/png');
      // photo.setAttribute('src', data);
    
      capturePictures.push(data);
      
      partnerCanvas.width = width;
      partnerCanvas.height = height;
      context1.drawImage(partnerVideo, 0, 0, width, height);
      // console.log(partnerCanvas);
      data = partnerCanvas.toDataURL('image/png');
      // photo.setAttribute('src', data);
    
      capturePictures.push(data);

    // convertURIToImageData( data ).then(function(imageData) {
        // Here you can use imageData
        // console.log(imageData);
      // });

    } else {
      clearphoto();
    }
  }

  return capturePictures;

}

export default PhotoCapture;