var app = (function() {
  main();

  function main() {
    document.addEventListener('deviceready', onDeviceReady, false);
    document.getElementById('start_animation').onclick = startAnimation;
  }

  function onDeviceReady() {
    document.getElementById('deviceready').querySelector('.listening').setAttribute('style', 'display:none;');
    var readyBlocks = document.body.querySelectorAll('.ready');

    for(var i = readyBlocks.length; i--;) {
      readyBlocks[i].setAttribute('style', 'display:block;');
    }

    console.log('Device is ready');
  }

  function startAnimation() {
    console.log('animation');
    alert('animation');
  }

  return {onDeviceReady: onDeviceReady};
})();
