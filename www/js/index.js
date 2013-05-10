(function() {
  main();

  function main() {
    document.addEventListener('deviceready', onDeviceReady, false);
  }

  function onDeviceReady() {
    document.getElementById('deviceready').querySelector('.listening').setAttribute('style', 'display:none;');
    var readyBlocks = document.body.querySelectorAll('.ready');

    for(var i = readyBlocks.length; i--;) {
      readyBlocks[i].setAttribute('style', 'display:block;');
    }

    console.log('Device is ready');
  }
})();
