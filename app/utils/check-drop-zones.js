const dropZones = {};

function mapOverDropZone(touchX, touchY) {
  return Object.keys(dropZones).map(index => {
    const element = dropZones[index];
    const { width, height, top, left } = element.getBoundingClientRect();
    if (touchY >= top && touchY <= top + height) {
      if (touchX >= left && touchX <= left + width) {
        return {
          index: parseInt(element.attributes['data-index'].value, 10),
          found: true,
          element
        };
      }
    }
    return { index, found: false };
  });
}

function addDropZone(id, element) {
  dropZones[id] = element;
  // console.log('added', id);
  // console.log('zone', dropZones);
}

function removeDropZone(id) {
  // delete dropZones[id];
  // console.log('removed', id);
  // console.log('zone', dropZones);
}

export { mapOverDropZone, addDropZone, removeDropZone };
