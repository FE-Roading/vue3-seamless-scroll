import { defineComponent, ref, computed, watch, nextTick, onBeforeMount, onMounted, createVNode, Fragment, getCurrentInstance } from 'vue';

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {number} delay -                  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher)
 *                                            are most useful.
 * @param {Function} callback -               A function to be executed after delay milliseconds. The `this` context and all arguments are passed through,
 *                                            as-is, to `callback` when the throttled-function is executed.
 * @param {object} [options] -              An object to configure options.
 * @param {boolean} [options.noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds
 *                                            while the throttled-function is being called. If noTrailing is false or unspecified, callback will be executed
 *                                            one final time after the last throttled-function call. (After the throttled-function has not been called for
 *                                            `delay` milliseconds, the internal counter is reset).
 * @param {boolean} [options.noLeading] -   Optional, defaults to false. If noLeading is false, the first throttled-function call will execute callback
 *                                            immediately. If noLeading is true, the first the callback execution will be skipped. It should be noted that
 *                                            callback will never executed if both noLeading = true and noTrailing = true.
 * @param {boolean} [options.debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is
 *                                            false (at end), schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function} A new, throttled, function.
 */
function throttle (delay, callback, options) {
  var _ref = options || {},
      _ref$noTrailing = _ref.noTrailing,
      noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing,
      _ref$noLeading = _ref.noLeading,
      noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading,
      _ref$debounceMode = _ref.debounceMode,
      debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */


  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel(options) {
    var _ref2 = options || {},
        _ref2$upcomingOnly = _ref2.upcomingOnly,
        upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;

    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`
       * and noLeading != true.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        /*
         * In throttle mode with noLeading, if `delay` time has
         * been exceeded, update `lastExec` and schedule `callback`
         * to execute after `delay` ms.
         */
        lastExec = Date.now();

        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        /*
         * In throttle mode without noLeading, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec();
      }
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

function useExpose(apis) {
  const instance = getCurrentInstance();
  if (instance) {
    Object.assign(instance.proxy, apis);
  }
}
const Props = {
  // 是否开启自动滚动
  modelValue: {
    type: Boolean,
    default: true
  },
  // 原始数据列表
  list: {
    type: Array,
    required: true,
    default: []
  },
  // 步进速度，step 需是单步大小的约数
  step: {
    type: Number,
    default: 1
  },
  // 开启滚动的数据量
  limitScrollNum: {
    type: Number,
    default: 3
  },
  // 是否开启鼠标悬停
  hover: {
    type: Boolean,
    default: false
  },
  // 控制滚动方向
  direction: {
    type: String,
    default: "up"
  },
  // 单步运动停止的高度
  singleHeight: {
    type: Number,
    default: 0
  },
  // 单步运动停止的宽度
  singleWidth: {
    type: Number,
    default: 0
  },
  // 单步停止等待时间 (默认值 1000ms)
  singleWaitTime: {
    type: Number,
    default: 1000
  },
  // 是否开启 rem 度量
  isRemUnit: {
    type: Boolean,
    default: false
  },
  // 开启数据更新监听
  isWatch: {
    type: Boolean,
    default: true
  },
  // 动画时间
  delay: {
    type: Number,
    default: 0
  },
  // 动画方式
  ease: {
    type: [String, Object],
    default: "ease-in"
  },
  // 动画循环次数，-1 表示一直动画
  count: {
    type: Number,
    default: -1
  },
  // 拷贝几份滚动列表
  copyNum: {
    type: Number,
    default: 1
  },
  // 开启鼠标悬停时支持滚轮滚动
  wheel: {
    type: Boolean,
    default: false
  },
  // 启用单行滚动
  singleLine: {
    type: Boolean,
    default: false
  }
};
globalThis.window.cancelAnimationFrame = function () {
  return globalThis.window.cancelAnimationFrame ||
  // @ts-ignore
  globalThis.window.webkitCancelAnimationFrame ||
  // @ts-ignore
  globalThis.window.mozCancelAnimationFrame ||
  // @ts-ignore
  globalThis.window.oCancelAnimationFrame ||
  // @ts-ignore
  globalThis.window.msCancelAnimationFrame || function (id) {
    return globalThis.window.clearTimeout(id);
  };
}();
globalThis.window.requestAnimationFrame = function () {
  return globalThis.window.requestAnimationFrame ||
  // @ts-ignore
  globalThis.window.webkitRequestAnimationFrame ||
  // @ts-ignore
  globalThis.window.mozRequestAnimationFrame ||
  // @ts-ignore
  globalThis.window.oRequestAnimationFrame ||
  // @ts-ignore
  globalThis.window.msRequestAnimationFrame || function (callback) {
    return globalThis.window.setTimeout(callback, 1000 / 60);
  };
}();
function dataWarm(list) {
  if (list && typeof list !== "boolean" && list.length > 100) {
    console.warn(`数据达到了${list.length}条有点多哦~,可能会造成部分老旧浏览器卡顿。`);
  }
}
const Vue3SeamlessScroll = defineComponent({
  name: "vue3-seamless-scroll",
  inheritAttrs: false,
  props: Props,
  emits: ["stop", "count", "move"],
  setup(_props, {
    slots,
    emit,
    attrs
  }) {
    const props = _props;
    const scrollRef = ref(null);
    const slotListRef = ref(null);
    const realBoxRef = ref(null);
    const reqFrame = ref(null);
    const singleWaitTimeout = ref(null);
    const realBoxWidth = ref(0);
    const realBoxHeight = ref(0);
    const xPos = ref(0);
    const yPos = ref(0);
    const isHover = ref(false);
    const _count = ref(0);
    const isScroll = computed(() => props.list ? props.list.length >= props.limitScrollNum : false);
    const realBoxStyle = computed(() => {
      return {
        width: realBoxWidth.value ? `${realBoxWidth.value}px` : "auto",
        transform: `translate(${xPos.value}px,${yPos.value}px)`,
        // @ts-ignore
        transition: `all ${typeof props.ease === "string" ? props.ease : "cubic-bezier(" + props.ease.x1 + "," + props.ease.y1 + "," + props.ease.x2 + "," + props.ease.y2 + ")"} 0ms`,
        overflow: "hidden",
        display: props.singleLine ? "flex" : "block"
      };
    });
    const isHorizontal = computed(() => props.direction == "left" || props.direction == "right");
    const floatStyle = computed(() => {
      return isHorizontal.value ? {
        float: "left",
        overflow: "hidden",
        display: props.singleLine ? "flex" : "block",
        flexShrink: props.singleLine ? 0 : 1
      } : {
        overflow: "hidden"
      };
    });
    const baseFontSize = computed(() => {
      return props.isRemUnit ? parseInt(globalThis.window.getComputedStyle(globalThis.document.documentElement, null).fontSize) : 1;
    });
    const realSingleStopWidth = computed(() => props.singleWidth * baseFontSize.value);
    const realSingleStopHeight = computed(() => props.singleHeight * baseFontSize.value);
    const step = computed(() => {
      let singleStep;
      let _step = props.step;
      if (isHorizontal.value) {
        singleStep = realSingleStopWidth.value;
      } else {
        singleStep = realSingleStopHeight.value;
      }
      if (singleStep > 0 && singleStep % _step > 0) {
        console.error("如果设置了单步滚动，step 需是单步大小的约数，否则无法保证单步滚动结束的位置是否准确。~~~~~");
      }
      return _step;
    });
    const cancle = () => {
      cancelAnimationFrame(reqFrame.value);
      reqFrame.value = null;
    };
    const animation = (_direction, _step, isWheel) => {
      reqFrame.value = requestAnimationFrame(function () {
        const h = realBoxHeight.value / 2;
        const w = realBoxWidth.value / 2;
        if (_direction === "up") {
          if (Math.abs(yPos.value) >= h) {
            yPos.value = 0;
            _count.value += 1;
            emit("count", _count.value);
          }
          yPos.value -= _step;
        } else if (_direction === "down") {
          if (yPos.value >= 0) {
            yPos.value = h * -1;
            _count.value += 1;
            emit("count", _count.value);
          }
          yPos.value += _step;
        } else if (_direction === "left") {
          if (Math.abs(xPos.value) >= w) {
            xPos.value = 0;
            _count.value += 1;
            emit("count", _count.value);
          }
          xPos.value -= _step;
        } else if (_direction === "right") {
          if (xPos.value >= 0) {
            xPos.value = w * -1;
            _count.value += 1;
            emit("count", _count.value);
          }
          xPos.value += _step;
        }
        if (isWheel) {
          return;
        }
        let {
          singleWaitTime
        } = props;
        if (singleWaitTimeout.value) {
          clearTimeout(singleWaitTimeout.value);
        }
        if (!!realSingleStopHeight.value) {
          if (Math.abs(yPos.value) % realSingleStopHeight.value < _step) {
            singleWaitTimeout.value = setTimeout(() => {
              move();
            }, singleWaitTime);
          } else {
            move();
          }
        } else if (!!realSingleStopWidth.value) {
          if (Math.abs(xPos.value) % realSingleStopWidth.value < _step) {
            singleWaitTimeout.value = setTimeout(() => {
              move();
            }, singleWaitTime);
          } else {
            move();
          }
        } else {
          move();
        }
      });
    };
    const move = () => {
      cancle();
      if (isHover.value || !isScroll.value || _count.value === props.count) {
        emit("stop", _count.value);
        _count.value = 0;
        return;
      }
      animation(props.direction, step.value, false);
    };
    const initMove = () => {
      dataWarm(props.list);
      if (isHorizontal.value) {
        let slotListWidth = slotListRef.value.offsetWidth;
        slotListWidth = slotListWidth * 2 + 1;
        realBoxWidth.value = slotListWidth;
      }
      if (isScroll.value) {
        realBoxHeight.value = realBoxRef.value.offsetHeight;
        if (props.modelValue) {
          move();
        }
      } else {
        cancle();
        yPos.value = xPos.value = 0;
      }
    };
    const startMove = () => {
      isHover.value = false;
      move();
    };
    const stopMove = () => {
      isHover.value = true;
      if (singleWaitTimeout.value) {
        clearTimeout(singleWaitTimeout.value);
      }
      cancle();
    };
    const hoverStop = computed(() => props.hover && props.modelValue && isScroll.value);
    const throttleFunc = throttle(30, e => {
      cancle();
      const singleHeight = !!realSingleStopHeight.value ? realSingleStopHeight.value : 15;
      if (e.deltaY < 0) {
        animation("down", singleHeight, true);
      }
      if (e.deltaY > 0) {
        animation("up", singleHeight, true);
      }
    });
    const onWheel = e => {
      throttleFunc(e);
    };
    const reset = () => {
      cancle();
      isHover.value = false;
      initMove();
    };
    const Reset = () => {
      reset();
    };
    useExpose({
      Reset
    });
    watch(() => props.list, () => {
      if (props.isWatch) {
        nextTick(() => {
          reset();
        });
      }
    }, {
      deep: true
    });
    watch(() => props.modelValue, newValue => {
      if (newValue) {
        startMove();
      } else {
        stopMove();
      }
    });
    watch(() => props.count, newValue => {
      if (newValue !== 0) {
        startMove();
      }
    });
    onBeforeMount(() => {
      cancle();
      clearTimeout(singleWaitTimeout.value);
    });
    onMounted(() => {
      if (isScroll.value) {
        if (props.delay) {
          singleWaitTimeout.value = setTimeout(initMove, props.delay);
        } else {
          initMove();
        }
      }
    });
    const {
      default: $default,
      html
    } = slots;
    const copyNum = new Array(props.copyNum).fill(null);
    const getHtml = () => {
      return createVNode(Fragment, null, [createVNode("div", {
        "ref": slotListRef,
        "style": floatStyle.value
      }, [$default && $default()]), isScroll.value ? copyNum.map(() => {
        if (html && typeof html === "function") {
          return createVNode("div", {
            "style": floatStyle.value
          }, [html()]);
        } else {
          return createVNode("div", {
            "style": floatStyle.value
          }, [$default && $default()]);
        }
      }) : null]);
    };
    return () => createVNode("div", {
      "ref": scrollRef,
      "class": attrs.class
    }, [props.wheel && props.hover ? createVNode("div", {
      "ref": realBoxRef,
      "style": realBoxStyle.value,
      "onMouseenter": () => {
        if (hoverStop.value) {
          stopMove();
        }
      },
      "onMouseleave": () => {
        if (hoverStop.value) {
          startMove();
        }
      },
      "onWheel": e => {
        if (hoverStop.value) {
          onWheel(e);
        }
      }
    }, [getHtml()]) : createVNode("div", {
      "ref": realBoxRef,
      "style": realBoxStyle.value,
      "onMouseenter": () => {
        if (hoverStop.value) {
          stopMove();
        }
      },
      "onMouseleave": () => {
        if (hoverStop.value) {
          startMove();
        }
      }
    }, [getHtml()])]);
  }
});

const install = function (app, options = {}) {
  app.component(options.name || Vue3SeamlessScroll.name, Vue3SeamlessScroll);
};

function index (app) {
  app.use(install);
}

export { Vue3SeamlessScroll, index as default };
