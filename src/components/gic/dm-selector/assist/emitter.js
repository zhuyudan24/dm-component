// 向下查找
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat([params]));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}

// 向上查找组件
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        parent.$emit.apply(parent, [eventName, params]);
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },

    findComponentUpward(context, componentName) {
      let parent = context.$parent;
      let name = parent.$options.name;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.name;
        }
      }
      return parent;
    }

    // findAnyComponent(componentName, root = null) {
    //   if (!root) {
    //     root = this.$root;
    //   }
    //   const childrens = root.$children;
    //   let children = null;

    //   if (childrens.length) {
    //     for (const child of childrens) {
    //       const name = child.$options.name;
    //       if (name === componentName) {
    //         children = child;
    //         break;
    //       } else {
    //         children = findAnyComponent.call(this, componentName, child);
    //         if (children) break;
    //       }
    //     }
    //   }
    //   return children;
    // }
  }
};
