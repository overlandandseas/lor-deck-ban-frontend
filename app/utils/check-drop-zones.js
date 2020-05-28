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
}

export { mapOverDropZone, addDropZone };
