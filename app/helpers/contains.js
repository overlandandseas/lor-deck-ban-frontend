import { helper } from '@ember/component/helper';

export default helper(function eq(params /*, hash*/) {
  return params[0].includes(params[1]);
});
