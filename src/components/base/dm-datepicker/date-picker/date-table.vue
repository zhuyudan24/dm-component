<template>
  <table cellspacing="0" cellpadding="0" class="el-date-table" @click="handleClick" @mousemove="handleMouseMove" :class="{ 'is-week-mode': selectionMode === 'week' }">
    <tbody>
      <!-- th部分是 周的UI表现 默认周日到周六 -->
      <tr>
        <th v-for="(week, key) in WEEKS" :key="key">{{ t('el.datepicker.weeks.' + week) }}</th>
      </tr>

      <tr class="el-date-table__row" v-for="(row, key) in rows" :class="{ current: isWeekActive(row[1]) }" :key="key">
        <td v-for="(cell, key) in row" :class="getCellClasses(cell)" :key="key">
          <div>
            <span>
              {{ cell.text }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
/* eslint-disable */
import { hasClass, removeClass } from '../dom';
import { getFirstDayOfMonth, getDayCountOfMonth, getStartDateOfMonth, coerceTruthyValueToArray, arrayFind, nextDate, arrayFindIndex } from './utils';

import Locale from '../src/mixins/locale';

const WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// 清除时间为当前 00:00:00
const clearHours = time => {
  const cloneDate = new Date(time);
  cloneDate.setHours(0, 0, 0, 0);
  return cloneDate.getTime();
};

const removeFormArray = (arr, pred) => {
  const idx = typeof pred === 'function' ? arrayFindIndex(arr, pred) : arr.indexOf(pred);
  return idx >= 0 ? [...arr.slice(0, idx), ...arr.slice(idx + 1)] : arr;
};

export default {
  name: 'DateTable',

  mixins: [Locale],

  props: {
    // 周的起始日 1 到 7 默认 7
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val => 1 && val <= 7
    },

    date: {},

    selectionMode: {
      default: 'day'
    },

    showWeekNumber: {
      type: Boolean,
      default: false
    },

    value: {},

    minDate: {},

    maxDate: {},

    // 范围
    rangeState: {
      default() {
        return {
          endDate: null,
          selecting: false,
          row: null,
          column: null
        };
      }
    }
  },

  computed: {
    offsetDay() {
      const week = this.firstDayOfWeek;
      // 周日为界限 左右偏移的天数 周一就是 -1 调整两行日期的位置
      return week > 3 ? 7 - week : -week;
    },

    WEEKS() {
      const week = this.firstDayOfWeek;
      return WEEKS.concat(WEEKS).slice(week, week + 7);
    },

    year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    },

    startDate() {
      return getStartDateOfMonth(this.year, this.month);
    },

    rows() {
      // 要得到当月1号是周几 然后算出前面有几位 就算出上个月有几天 如果1号是周日 没有上月
      const date = new Date(this.year, this.month, 1);

      let day = getFirstDayOfMonth(date); // 得到这个月第一天是周几

      // 这个月有多少天
      const dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth() + 1);

      // dateCountOfLastMonth 上个月有多少天
      const dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth() === 0 ? 11 : date.getMonth() - 1);

      // 这个月的第一天
      day = day === 0 ? 7 : day;

      const rows = this.tableRows;
      const offset = this.offsetDay;
      let count = 1;
      let firstDayPosition; // 第一天的位置

      // 日历第一天的日期
      const startDate = this.startDate;
      const selectionDate = this.selectionMode === 'date' ? coerceTruthyValueToArray(this.value) : [];
      const now = clearHours(new Date());

      for (let i = 0; i < 6; i++) {
        const row = rows[i];

        for (let j = 0; j < 7; j++) {
          let cell = row[this.showWeekNumber ? j + 1 : j];
          if (!cell) {
            cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false };
          }
          cell.type = 'normal';

          const index = i * 7 + j;
          /**
           * 这里是最主要的逻辑 startDate是
           *
           */
          const time = +nextDate(startDate, index - offset);
          cell.inRange = time >= clearHours(this.minDate) && time <= clearHours(this.maxDate);
          cell.start = this.minDate && time === clearHours(this.minDate);
          cell.end = this.maxDate && time === clearHours(this.maxDate);
          const isToday = time === now;

          // if (isToday) {
          //   cell.type = 'today';
          // }

          // 存在第一行和第二行有上个月的数据
          if (i >= 0 && i <= 1) {
            // day 是周几
            // 如果这个月的1号是周四 那么就表示 周日 周一 周二 周三 都是上个月的
            // 所以 0 - 3 都是上个月的
            if (j + i * 7 >= day + offset) {
              cell.text = count++;
              // 这里就是第一天的位置
              if (count === 2) {
                firstDayPosition = i * 7 + j;
              }
            } else {
              // dateCountOfLastMonth 上个月有多少天 2018 9月 有30 4 - 0 + 1
              cell.text = dateCountOfLastMonth - (day + offset - (j % 7)) + 1 + i * 7;
              cell.type = 'prev-month';
            }
          } else {
            // 如果count 小于这个月的天数 就都是当月的数据
            if (count <= dateCountOfMonth) {
              cell.text = count++;
              if (count === 2) {
                firstDayPosition = i * 7 + j;
              }
            } else {
              // 继续加 然后减去当月天数 就等价于下个月的日期
              cell.text = count++ - dateCountOfMonth;
              cell.type = 'next-month';
            }
          }

          let cellDate = new Date(time);
          cell.selected = arrayFind(selectionDate, date => date.getTime() === cellDate.getTime());

          this.$set(row, this.showWeekNumber ? j + 1 : j, cell);
        }
      }
      rows.firstDayPosition = firstDayPosition;
      return rows;
    }
  },

  watch: {
    'rangeState.endDate'(newVal) {
      this.markRange(newVal);
    },

    minDate(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.rangeState.selecting = true;
        this.markRange(newVal);
      } else if (!newVal) {
        this.rangeState.selecting = false;
        this.markRange(newVal);
      } else {
        this.markRange();
      }
    },

    maxDate(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.rangeState.selecting = false;
        this.markRange(newVal);
      }
    }
  },

  data() {
    return {
      tableRows: [[], [], [], [], [], []]
    };
  },

  methods: {
    handleClick(event) {
      let target = event.target;
      // 如果点击span span里是当前日期数
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }

      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }

      if (target.tagName !== 'TD') return;
      // 超过今天之后的日期不能选的场景 是 disabled
      if (hasClass(target, 'disabled') || hasClass(target, 'week')) return;

      const selectionMode = this.selectionMode;

      // 如果是选择周的模式 目标节点是
      if (selectionMode === 'week') {
        // 默认日期是周日 所以这边周模式就是 第二个td开始
        target = target.parentNode.cells[1];
      }

      let year = Number(this.year);
      let month = Number(this.month);

      // 当前tr列的索引 从0开始
      // target 是 td th
      const cellIndex = target.cellIndex;
      // tr的行索引 从0 开始
      // target 是 tr
      const rowIndex = target.parentNode.rowIndex;
      // 日期是从td开始渲染的
      const cell = this.rows[rowIndex - 1][cellIndex];

      // 日期
      const text = cell.text;

      const className = target.className;
      // 当月第一天
      const newDate = new Date(year, month, 1);

      // 如果当月 不是上个月或下个月
      if (className.indexOf('prev') !== -1) {
        if (month === 0) {
          year = year - 1;
          month = 11;
        } else {
          month = month - 1;
        }
        newDate.setFullYear(year);
        newDate.setMonth(month);
      } else if (className.indexOf('next') !== -1) {
        // 如果是下个月
        if (month === 11) {
          year = year + 1;
          month = 0;
        } else {
          month = month + 1;
        }
        newDate.setFullYear(year);
        newDate.setMonth(month);
      }
      // 设置当前日期
      newDate.setDate(parseInt(text, 10));

      if (this.selectionMode === 'range') {
        if (this.minDate && this.maxDate) {
          // 当已经选好了范围 再次选择
          console.log('min && max');
          const minDate = new Date(newDate.getTime());
          const maxDate = null;

          this.$emit('pick', { minDate, maxDate }, false);
          this.rangeState.selecting = true;
          this.markRange(this.minDate);
          this.$nextTick(() => {
            this.handleMouseMove(event);
          });
        } else if (this.minDate && !this.maxDate) {
          // 选择返回结束点 存在 开始时间节点 没有结束时间节点
          if (newDate >= this.minDate) {
            const maxDate = new Date(newDate.getTime());
            this.rangeState.selecting = false;

            this.$emit('pick', {
              minDate: this.minDate,
              maxDate
            });
          } else {
            const minDate = new Date(newDate.getTime());
            this.rangeState.selecting = false;

            this.$emit('pick', { minDate, maxDate: this.minDate });
          }
        } else if (!this.minDate) {
          // 点击最大的范围
          const minDate = new Date(newDate.getTime());

          this.$emit('pick', { minDate, maxDate: this.maxDate }, false);
          this.rangeState.selecting = true;
          this.markRange(this.minDate);
        }
      } else if (selectionMode === 'day') {
        this.$emit('pick', newDate);
      } else if (selectionMode === 'week') {
        const weekNumber = getWeekNumber(newDate);

        const value = newDate.getFullYear() + 'w' + weekNumber;
        this.$emit('pick', {
          year: newDate.getFullYear(),
          week: weekNumber,
          value: value,
          date: newDate
        });
      } else if (selectionMode === 'dates') {
        const value = this.value || [];
        const newValue = cell.selected ? removeFromArray(value, date => date.getTime() === newDate.getTime()) : [...value, newDate];
        this.$emit('pick', newValue);
      }
    },

    handleMouseMove(event) {
      if (!this.rangeState.selecting) return;

      this.$emit('changerange', {
        minDate: this.minDate,
        maxDate: this.maxDate,
        rangeState: this.rangeState
      });

      let target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }

      if (target.tagName !== 'TD') return;

      const column = target.cellIndex;
      const row = target.parentNode.rowIndex - 1;

      const { row: oldRow, column: oldColumn } = this.rangeState;

      if (oldRow !== row || oldColumn !== column) {
        this.rangeState.row = row;
        this.rangeState.column = column;

        this.rangeState.endDate = this.getDateOfCell(row, column);
      }
    },

    getDateOfCell(row, column) {
      const offsetFromStart = row * 7 + (column - (this.showWeekNumber ? 1 : 0)) - this.offsetDay;
      return nextDate(this.startDate, offsetFromStart);
    },

    isWeekActive(cell) {
      if (this.selectionMode !== 'week') return false;

      const newDate = new Date(this.year, this.month + 1);
      const year = newDate.getFullYear();
      const month = newDate.getMonth();

      if (cell.type === 'prev-month') {
        newDate.setMonth(month === 0 ? 11 : month - 1);
        newDate.setFullYear = newDate.getMonth();
      }

      if (cell.type === 'next-month') {
        newDate.setMonth(month === 11 ? 0 : month - 1);
        newDate.setFullYear(month === 0 ? year + 1 : year);
      }

      newDate.setDate(parseInt(cell.text, 10));

      const valueYear = isDate(this.value) ? this.value.getFullYear() : null;
      return year === valueYear && getWeekNumber(newDate) === getWeekNumber(this.value);
    },

    getCellClasses(cell) {
      const selectionMode = this.selectionMode;
      const defaultValue = this.defaultValue ? (Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue]) : [];

      let classes = [];

      if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
        // 当月
        classes.push('available');
        if (cell.type === 'today') {
          classes.push('today');
        }
      } else {
        classes.push(cell.type);
      }

      if (cell.type === 'normal' && defaultValue.some(date => this.cellMatchesDate(cell, date))) {
        classes.push('default');
      }

      // 当前选中的样式 模式是day cell 里面都是每个日期的类型 范围 是否 开始 结束 type
      if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') && this.cellMatchesDate(cell, this.value)) {
        classes.push('current');
      }

      // 日期范围 给两个日期前后边加上范围起始类 start-date end-date
      if ((cell.inRange && (cell.type === 'normal' || cell.type === 'today')) || this.selectionMode === 'week') {
        classes.push('in-range');
        if (cell.start) {
          classes.push('start-date');
        }

        if (cell.end) {
          classes.push('end-date');
        }
      }
      return classes.join(' ');
    },

    cellMatchesDate(cell, date) {
      const value = new Date(date);
      return this.year === value.getFullYear() && this.month === value.getMonth() && Number(cell.text) === value.getDate();
    },

    markRange(maxDate) {
      const startDate = this.startDate;
      if (!maxDate) {
        maxDate = this.maxDate;
      }

      const rows = this.rows;
      const minDate = this.minDate;
      for (let i = 0, k = rows.length; i < k; i++) {
        const row = rows[i];
        for (let j = 0, l = row.length; j < l; j++) {
          if (this.showWeekNumber && j === 0) continue;

          const cell = row[j];
          const index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
          const time = nextDate(startDate, index - this.offsetDay).getTime();

          if (maxDate && maxDate < minDate) {
            cell.inRange = minDate && time >= clearHours(maxDate) && time <= clearHours(minDate);
            cell.start = maxDate && time === clearHours(maxDate.getTime());
            cell.end = minDate && time === clearHours(minDate.getTime());
          } else {
            cell.inRange = minDate && time >= clearHours(minDate) && time <= clearHours(maxDate);
            cell.start = minDate && time === clearHours(minDate.getTime());
            cell.end = maxDate && time === clearHours(maxDate.getTime());
          }
        }
      }
    }
  }
};
</script>
