```
<vue-area-ab :projectName="projectName" :areaOptions="areaOptions" @selected="selected"></vue-area-ab>

data() {
  return {
    // 可传参数
    projectName: '', // 当前项目名
    areaOptions: {
      provinceName: '',
      provinceId: '',
      cityName: '',
      cityId: '',
      countryName: '',
      countyId: ''
    },
  }
}
methods: {
  selected(val) {
    console.log(val+"/////")
  }
},
```

