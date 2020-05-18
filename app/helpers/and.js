import { helper } from '@ember/component/helper';

export default helper(function and(params /*, hash*/) {
  return params.reduce((acc, i) => acc && i, true);
});
