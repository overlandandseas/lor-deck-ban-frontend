import { helper } from '@ember/component/helper';

export default helper(function linkOrNot(params) {
  const [regionName] = params;

  return regionName.replace(/\s|&/g, '');
});
