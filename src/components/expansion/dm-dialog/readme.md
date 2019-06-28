## 弹出框控制弹出的样式

**修改如下**
```css
.dialog-fade-enter-active {
  -webkit-animation: dialog-fade-in .3s;
          animation: dialog-fade-in .3s;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.dialog-fade-leave-active {
  -webkit-animation: dialog-fade-out .3s;
          animation: dialog-fade-out .3s;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.dialog-fade-enter-active {
  transform: scale(0);
  -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
          animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
}
.dialog-fade-leave-active {
  -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
          animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
}

@-webkit-keyframes dialog-fade-in{
  0% {
    transform: scale(0);
    transform-origin: 50% 50%;
    opacity: 0;
  }
  100% {
    transform: scale(1.0);
    transform-origin: 50% 50%;
    opacity: 1;
  }
}
@keyframes dialog-fade-in {
  0% {
    transform: scale(0);
    transform-origin: 50% 50%;
    opacity: 0;
  }
  100% {
    transform: scale(1.0);
    transform-origin: 50% 50%;
    opacity: 1;
  }
}
@-webkit-keyframes dialog-fade-out {
  0% {
    transform: scale(1.0);
    transform-origin: 50% 50%;
    opacity: 0;
  }
  100% {
    transform-origin: 50% 50%;
    opacity: 0;
    transform: scale(0.6);
  }
}
@keyframes dialog-fade-out{
  0% {
    transform: scale(1.0);
    transform-origin: 50% 50%;
  }
  100% {
    transform-origin: 50% 50%;
    opacity: 0;
    transform: scale(0.6);
  }
}
```