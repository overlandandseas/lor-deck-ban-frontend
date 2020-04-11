import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';


function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}


export default helper(function linkOrNot(params) {
  const [ deckLink ] =  params

  if (deckLink && isValidHttpUrl(deckLink)) {
    return htmlSafe(`<a href="${deckLink}" class="link blue underline-hover" target="_blank">${deckLink}</a>`)
  } else {
    return deckLink;
  }
});
