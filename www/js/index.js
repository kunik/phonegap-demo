(function() {
  main();

  function main() {
    document.addEventListener('deviceready', onDeviceReady, false);
  }

  function onDeviceReady() {
    var parentElement = document.getElementById('deviceready');
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
})();
