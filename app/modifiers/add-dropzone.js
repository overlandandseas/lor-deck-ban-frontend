import { modifier } from 'ember-modifier';
import { addDropZone } from 'lor-card-ban-frontend/utils/check-drop-zones';

export default modifier((element, [id]) => {
  addDropZone(id, element);
});
