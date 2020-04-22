import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function linkOrNot(params) {
  const [ regionName ] =  params

  return regionName.replace(/\s|&/g, '');
});
