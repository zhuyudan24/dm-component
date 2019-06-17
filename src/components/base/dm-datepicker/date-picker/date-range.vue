<template>
  <transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div v-show="visible" class="el-picker-panel el-date-range-picker el-popper" :class="[popperClass]">
      <div class="el-picker-panel__body-wrapper">
        <div class="el-picker-panel__body">
          <div class="el-picker-panel__content el-date-range-picker__content is-left">
            <div class="el-date-range-picker__header">
              <button type="button" @click="leftPrevMonth" class="el-picker-panel__icon-btn el-icon-arrow-left"></button>
              <div>{{ leftLabel }}</div>
            </div>
            <date-table selection-mode="range" :date="leftDate" :default-value="defaultValue" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"> </date-table>
          </div>
          <div class="el-picker-panel__content el-date-range-picker__content is-right">
            <div class="el-date-range-picker__header">
              <button type="button" @click="rightNextMonth" class="el-picker-panel__icon-btn el-icon-arrow-right"></button>
              <div>{{ rightLabel }}</div>
            </div>
            <date-table selection-mode="range" :date="rightDate" :default-value="defaultValue" :min-date="minDate" :max-date="maxDate" :range-state="rangeState" :disabled-date="disabledDate" @changerange="handleChangeRange" :first-day-of-week="firstDayOfWeek" @pick="handleRangePick"> </date-table>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
import { isDate, nextMonth, prevMonth, modifyWithTimeString } from './utils';
import Clickoutside from './clickoutside';
import Locale from '../src/mixins/locale';
import DateTable from './date-table';

const advanceDate = (date, amount) => {
  return new Date(new Date(date).getTime() + amount);
};

const calcDefaultValue = defaultValue => {
  if (Array.isArray(defaultValue)) {
    return [new Date(defaultValue[0]), new Date(defaultValue[1])];
  } else if (defaultValue) {
    return [new Date(defaultValue), advanceDate(defaultValue, 24 * 60 * 60 * 1000)];
  } else {
    return [new Date(2020, 0, 1), advanceDate(+new Date(2020, 0, 1), 24 * 60 * 60 * 1000)];
  }
};

export default {
  mixins: [Locale],

  components: { DateTable },

  directives: { Clickoutside },

  computed: {
    leftLabel() {
      return this.t(`el.datepicker.month${this.leftDate.getMonth() + 1}`);
    },

    rightLabel() {
      return this.t(`el.datepicker.month${this.rightDate.getMonth() + 1}`);
    }
  },

  watch: {
    minDate(val) {
      this.$nextTick(() => {
        if (this.$refs.maxTimePicker && this.maxDate && this.maxDate < this.minDate) {
          const format = 'HH:mm:ss';
          // eslint-disable-next-line
          this.$refs.maxTimePicker.selectableRange = [[parseDate(formatDate(this.minDate, format), format), parseDate('23:59:59', format)]];
        }
      });
      if (val && this.$refs.minTimePicker) {
        this.$refs.minTimePicker.date = val;
        this.$refs.minTimePicker.value = val;
      }
    },

    maxDate(val) {
      if (val && this.$refs.maxTimePicker) {
        this.$refs.maxTimePicker.date = val;
        this.$refs.maxTimePicker.value = val;
      }
    },

    minTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.minTimePicker.date = this.minDate;
          this.$refs.minTimePicker.value = this.minDate;
          this.$refs.minTimePicker.adjustSpinners();
        });
      }
    },

    maxTimePickerVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.maxTimePicker.date = this.maxDate;
          this.$refs.maxTimePicker.value = this.maxDate;
          this.$refs.maxTimePicker.adjustSpinners();
        });
      }
    },

    value(newVal) {
      if (!newVal) {
        this.minDate = null;
        this.maxDate = null;
      } else if (Array.isArray(newVal)) {
        this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
        this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
        if (this.minDate) {
          this.leftDate = this.minDate;
          if (this.unlinkPanels && this.maxDate) {
            const minDateYear = this.minDate.getFullYear();
            const minDateMonth = this.minDate.getMonth();
            const maxDateYear = this.maxDate.getFullYear();
            const maxDateMonth = this.maxDate.getMonth();
            this.rightDate = minDateYear === maxDateYear && minDateMonth === maxDateMonth ? nextMonth(this.maxDate) : this.maxDate;
          } else {
            this.rightDate = nextMonth(this.leftDate);
          }
        } else {
          this.leftDate = calcDefaultValue(this.defaultValue)[0];
          this.rightDate = nextMonth(this.leftDate);
        }
      }
    },

    defaultValue(val) {
      if (!Array.isArray(this.value)) {
        const [left, right] = calcDefaultValue(val);
        this.leftDate = left;
        this.rightDate = val && val[1] && this.unlinkPanels ? right : nextMonth(this.leftDate);
      }
    }
  },

  data() {
    return {
      popperClass: '',
      value: [],
      defaultValue: null,
      defaultTime: null,
      minDate: '',
      maxDate: '',
      leftDate: new Date(2020, 0, 1),
      rightDate: nextMonth(new Date(2020, 0, 1)),
      rangeState: {
        endDate: null,
        selecting: false,
        row: null,
        column: null
      },
      showTime: false,
      shortcuts: '',
      visible: '',
      disabledDate: '',
      firstDayOfWeek: 7,
      minTimePickerVisible: false,
      maxTimePickerVisible: false,
      format: '',
      arrowControl: false,
      unlinkPanels: false,
      date: {}
    };
  },

  methods: {
    leftPrevMonth() {
      this.leftDate = prevMonth(this.leftDate);
      if (!this.unlinkPanels) {
        this.rightDate = nextMonth(this.leftDate);
      }
    },

    rightNextMonth() {
      if (!this.unlinkPanels) {
        this.leftDate = nextMonth(this.leftDate);
        this.rightDate = nextMonth(this.leftDate);
      } else {
        this.rightDate = nextMonth(this.rightDate);
      }
    },

    handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    },

    handleRangePick(val, close = true) {
      // 如果是end 且是
      const defaultTime = this.defaultTime || [];
      const minDate = modifyWithTimeString(val.minDate, defaultTime[0]);
      const maxDate = modifyWithTimeString(val.maxDate, defaultTime[1]);

      if (this.maxDate === maxDate && this.minDate === minDate) {
        return;
      }
      this.onPick && this.onPick(val);
      this.maxDate = maxDate;
      this.minDate = minDate;

      // workaround for https://github.com/ElemeFE/element/issues/7539
      setTimeout(() => {
        this.maxDate = maxDate;
        this.minDate = minDate;
      }, 10);
      if (!close || this.showTime) return;
      this.handleConfirm();
    },

    handleConfirm(visible = false) {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      }
    },

    isValidValue(value) {
      return Array.isArray(value) && value && value[0] && value[1] && isDate(value[0]) && isDate(value[1]) && value[0].getTime() <= value[1].getTime() && (typeof this.disabledDate === 'function' ? !this.disabledDate(value[0]) && !this.disabledDate(value[1]) : true);
    }
  }
};
</script>
