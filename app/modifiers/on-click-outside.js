import { modifier } from 'ember-modifier';

export default modifier((element, [callback]) => {
  function handleClick(event) {
    if (!element.contains(event.target)) {
      callback();
    }
  }

  function handleKeyDownEvent(evt) {
  if (evt.keyCode === 27) {
    callback()
  }
}


  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeyDownEvent);

  return () => {
    document.removeEventListener("click", handleClick)
    document.removeEventListener("keydown", handleKeyDownEvent);
  }
});
