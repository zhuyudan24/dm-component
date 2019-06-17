/* eslint-disable */
import Picker from './picker';
import DateRangePanel from './date-range';

const getPanel = function(type) {
  return DateRangePanel;
};

export default {
  mixins: [Picker],

  components: { Picker },

  name: 'vue-gic-datepicker',

  props: {
    type: {
      type: String,
      default: 'daterange'
    }
  },
  created() {
    this.panel = getPanel(this.type);
  }
};
