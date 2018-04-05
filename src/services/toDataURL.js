async function toDataURL(file) {
  return new Promise(res => {

    //
    // const img = new Image();
    // img.onload = () => {
    //   const canvas = document.createElement('CANVAS');
    //   const ctx = canvas.getContext('2d');
    //   canvas.height = img.naturalHeight;
    //   canvas.width = img.naturalWidth;
    //   ctx.drawImage(img, 0, 0);
    //   res(canvas.toDataURL(file.type));
    // };
    // img.src = image.src;
  });
}

export { toDataURL }; //eslint-disable-line
