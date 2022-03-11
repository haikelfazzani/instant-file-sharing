let array = [];

self.addEventListener('message', event => {
  if (event.data === 'download') {
    const blob = new Blob(array);
    self.postMessage(blob);
    array = [];
  }
  else {
    if (event.data) array.push(event.data);
    else array = [];
  }
})