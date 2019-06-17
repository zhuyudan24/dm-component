<template>
  <div class="birth-select">
    <div class="start-date date-block">
      <el-select v-model="startVal[0]" style="width: 100px" placeholder="月份" @change="handleStartMonthChange">
        <el-option v-for="item in MonthList" :value="item.value" :key="item.key" :label="item.label"> </el-option>
      </el-select>
      <span class="space"></span>
      <el-select v-model="startVal[1]" style="width: 100px" placeholder="日期" @change="handleStartDateChange">
        <el-option v-for="item in startDateList" :value="item.value" :key="item.key" :label="item.label"> </el-option>
      </el-select>
    </div>
    <span class="range">至</span>
    <div class="end-date date-block">
      <el-select v-model="endVal[0]" style="width: 100px" placeholder="月份" @change="handleEndMonthChange">
        <el-option v-for="item in MonthList" :value="item.value" :key="item.key" :label="item.label"> </el-option>
      </el-select>
      <span class="space"></span>
      <el-select v-model="endVal[1]" style="width: 100px" placeholder="日期" @change="handleEndDateChange">
        <el-option v-for="item in endDateList" :value="item.value" :key="item.key" :label="item.label"> </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GicSelect',

  props: {
    dateval: [String, Array]
  },

  data() {
    return {
      startVal: ['', ''],
      endVal: ['', ''],
      // 月份
      MonthList: [{ key: 1, value: '01', label: '1月' }, { key: 2, value: '02', label: '2月' }, { key: 3, value: '03', label: '3月' }, { key: 4, value: '04', label: '4月' }, { key: 5, value: '05', label: '5月' }, { key: 6, value: '06', label: '6月' }, { key: 7, value: '07', label: '7月' }, { key: 8, value: '08', label: '8月' }, { key: 9, value: '09', label: '9月' }, { key: 10, value: '10', label: '10月' }, { key: 11, value: '11', label: '11月' }, { key: 12, value: '12', label: '12月' }],
      // 日期
      daysList: [['01', '03', '05', '07', '08', '10', '12'], ['02'], ['04', '06', '09', '11']],
      startDateList: [
        { key: 1, value: '01', label: '1日' },
        { key: 2, value: '02', label: '2日' },
        { key: 3, value: '03', label: '3日' },
        { key: 4, value: '04', label: '4日' },
        { key: 5, value: '05', label: '5日' },
        { key: 6, value: '06', label: '6日' },
        { key: 7, value: '07', label: '7日' },
        { key: 8, value: '08', label: '8日' },
        { key: 9, value: '09', label: '9日' },
        { key: 10, value: '10', label: '10日' },
        { key: 11, value: '11', label: '11日' },
        { key: 12, value: '12', label: '12日' },
        { key: 13, value: '13', label: '13日' },
        { key: 14, value: '14', label: '14日' },
        { key: 15, value: '15', label: '15日' },
        { key: 16, value: '16', label: '16日' },
        { key: 17, value: '17', label: '17日' },
        { key: 18, value: '18', label: '18日' },
        { key: 19, value: '19', label: '19日' },
        { key: 20, value: '20', label: '20日' },
        { key: 21, value: '21', label: '21日' },
        { key: 22, value: '22', label: '22日' },
        { key: 23, value: '23', label: '23日' },
        { key: 24, value: '24', label: '24日' },
        { key: 25, value: '25', label: '25日' },
        { key: 26, value: '26', label: '26日' },
        { key: 27, value: '27', label: '27日' },
        { key: 28, value: '28', label: '28日' },
        { key: 29, value: '29', label: '29日' },
        { key: 30, value: '30', label: '30日' },
        { key: 31, value: '31', label: '31日' }
      ],
      endDateList: [
        { key: 1, value: '01', label: '1日' },
        { key: 2, value: '02', label: '2日' },
        { key: 3, value: '03', label: '3日' },
        { key: 4, value: '04', label: '4日' },
        { key: 5, value: '05', label: '5日' },
        { key: 6, value: '06', label: '6日' },
        { key: 7, value: '07', label: '7日' },
        { key: 8, value: '08', label: '8日' },
        { key: 9, value: '09', label: '9日' },
        { key: 10, value: '10', label: '10日' },
        { key: 11, value: '11', label: '11日' },
        { key: 12, value: '12', label: '12日' },
        { key: 13, value: '13', label: '13日' },
        { key: 14, value: '14', label: '14日' },
        { key: 15, value: '15', label: '15日' },
        { key: 16, value: '16', label: '16日' },
        { key: 17, value: '17', label: '17日' },
        { key: 18, value: '18', label: '18日' },
        { key: 19, value: '19', label: '19日' },
        { key: 20, value: '20', label: '20日' },
        { key: 21, value: '21', label: '21日' },
        { key: 22, value: '22', label: '22日' },
        { key: 23, value: '23', label: '23日' },
        { key: 24, value: '24', label: '24日' },
        { key: 25, value: '25', label: '25日' },
        { key: 26, value: '26', label: '26日' },
        { key: 27, value: '27', label: '27日' },
        { key: 28, value: '28', label: '28日' },
        { key: 29, value: '29', label: '29日' },
        { key: 30, value: '30', label: '30日' },
        { key: 31, value: '31', label: '31日' }
      ]
    };
  },
  methods: {
    //
    handleMonthValue(position, val) {
      const WM = this.daysList.findIndex((item, i) => {
        return item.includes(val);
      });
      if (position == 'start') {
        this.handleChangeData(this.startDateList, WM);
      } else if (position == 'end') {
        this.handleChangeData(this.endDateList, WM);
      }
    },
    handleChangeData(data, inx) {
      const length = data.length; // 31 29 30
      if (inx == 0) {
        // 31天
        this.handleLength(length, data, 0);
      } else if (inx == 2) {
        // 如果升级 30天
        this.handleLength(length, data, 1);
      } else {
        // 29天
        this.handleLength(length, data, 2);
      }
    },
    handleLength(length, data, days) {
      if (length == 31) {
        if (days == 0) {
          return;
        } else if (days == 1) {
          data.pop();
        } else if (days == 2) {
          data.splice(29, 2);
        }
      } else if (length == 30) {
        if (days == 0) {
          data.push({ key: 31, value: '31', label: '31日' });
        } else if (days == 1) {
          return;
        } else if (days == 2) {
          data.splice(29, 1);
        }
      } else if (length == 29) {
        if (days == 0) {
          data.push({ key: 30, value: '30', label: '30日' });
          data.push({ key: 31, value: '31', label: '31日' });
        } else if (days == 1) {
          data.push({ key: 30, value: '30', label: '30日' });
        } else if (days == 2) {
          return;
        }
      }
    },
    // 开始月份
    handleStartMonthChange(val) {
      this.handleMonthValue('start', val);
      this.handleDate();
      this.$emit('change');
    },
    handleStartDateChange(val) {
      this.handleDate();
      this.$emit('change');
    },
    handleEndMonthChange(val) {
      this.handleMonthValue('end', val);
      this.handleDate();
      this.$emit('change');
    },
    handleEndDateChange(val) {
      this.handleDate();
      this.$emit('change');
    },
    handleDate() {
      if (!this.startVal[0] || !this.startVal[0] || !this.endVal[0] || !this.endVal[1]) {
        return;
      }

      const start = this.startVal.join('');
      const end = this.endVal.join('');
      if (start - end > 0) {
        this.$message.warning('开始生日日期不能大于结束日期');
        this.$emit('update:dateval', '');
        return;
      }
      const value = [start, end];
      this.$emit('update:dateval', value);
    },
    // 回显数据
    replay(start, end) {
      this.startVal[0] = start.slice(0, 2);
      this.startVal[1] = start.slice(2, 4);
      this.endVal[0] = end.slice(0, 2);
      this.endVal[1] = end.slice(2, 4);
    }
  },

  created() {
    if (this.dateval[0] && this.dateval[1]) {
      this.replay(this.dateval[0], this.dateval[1]);
    }
  }
};
</script>

<style lang="scss" scoped>
.birth-select {
  .date-block {
    display: inline-block;
    .space {
      display: inline-block;
      width: 10px;
    }
  }
  .range {
    display: inline-block;
    vertical-align: middle;
    width: 30px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    text-align: center;
  }
}
</style>
