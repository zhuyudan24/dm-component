<template>
  <div>
    <div class="el-picker-panel__content">
      <date-table v-show="currentView === 'date'" :value="value" :date="date" :range-state="rangeState" :default-value="defaultValue ? new Date(defaultValue) : null"> </date-table>
    </div>
  </div>
</template>

<script type="text/babel">
/* eslint-disable */
import Locale from '../src/mixins/locale';
import DateTable from './date-table';

export default {
  name: 'GicDatePicker',

  components: {
    DateTable
  },

  mixins: [Locale],

  data() {
    return {
      value: '',
      date: new Date(),
      defaultValue: null,
      currentView: 'date' // 当前是日历组件 默认
    };
  }
};
</script>
