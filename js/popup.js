$(document).ready(function(){ 
  $('#close').click(function() { 
    $('#popup').fadeOut(500);
  });
  window.setTimeout(function() {
    var win = $(window);
    var width1 = $(window).width() || window.innerWidth || document.clientWidth;
    if(width1 <= 650) {
      var layerWidth = 300;
      var layerHeight = 390;
      var top = 20;
    }else{
      var layerWidth = 650;
      var layerHeight = 320;
      var top = win.height() / 2 - layerHeight / 2;
    }
    
    $('.popup-big')
      .css({
        'width': layerWidth + 'px',
        'height': layerHeight + 'px',
        'top': '-350px',
        //'left': '-' + layerWidth + 'px'
      'left': win.width() / 2 - layerWidth / 2
      })
      .animate({
        'top': top,
        //'left': win.width() / 2 - layerWidth / 2
    }, 1500);
  }, 500);
});