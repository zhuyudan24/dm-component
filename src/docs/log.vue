<template>
  <div>
    <section class="dm-section">
      <h3 class="dm-section--title">cdn库</h3>
      <div class="md">
        <code>
          <p>
            &lt;!-- 库文件 vue，vue-router，vuex，elementUI --&gt; &lt;!-- axios,皮肤样式暂不引用cdn --&gt;
          </p>
          <p>
            &lt;script src="//web-1251519181.file.myqcloud.com/lib/vue/2.6.6/vue.min.js"&gt;&lt;/script&gt;
          </p>
          <p>
            &lt;script src="//web-1251519181.file.myqcloud.com/lib/vue-router/3.0.2/vue-router.min.js"&gt;&lt;/script&gt;
          </p>
          <p>
            &lt;script src="//web-1251519181.file.myqcloud.com/lib/vuex/3.1.0/vuex.min.js"&gt;&lt;/script&gt;
          </p>
          <p>
            &lt;script src="//web-1251519181.file.myqcloud.com/lib/elementUI/index.2.5.4.js"&gt;&lt;/script&gt;
          </p>
          <br />
          <br />
          <template v-for="(v, i) in gicComponent">
            &lt;!-- {{ v.name }} --&gt;
            <p :key="'gic' + i">&lt;script src="//web-1251519181.file.myqcloud.com/components/{{ v.srcipt }}.js"&gt;&lt;/script&gt;</p>
          </template>
          <br />
          <br />
          <template v-for="(v, i) in baseComponent">
            &lt;!-- {{ v.name }} --&gt;
            <p :key="'base' + i">&lt;script src="//web-1251519181.file.myqcloud.com/components/{{ v.srcipt }}.js"&gt;&lt;/script&gt;</p>
          </template>
        </code>
      </div>
    </section>
    <section class="dm-section md">
      <MyMarkdown></MyMarkdown>
    </section>
  </div>
</template>
<script>
import componentsList from '../../components.json';
let gic = componentsList.gic;
let base = componentsList.base;
export default {
  name: 'log-view',
  data() {
    return {
      gicComponent: Object.keys(gic).map(v => ({ srcipt: v + '.' + gic[v].version, name: gic[v].name })),
      baseComponent: Object.keys(base).map(v => ({ srcipt: v + '.' + base[v].version, name: base[v].name }))
    };
  },
  components: {
    MyMarkdown: () => import('./log.md')
  }
};
</script>
