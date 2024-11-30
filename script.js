// Получение контекста для рисования
let canvas = window.document.querySelector("canvas");
let context = canvas.getContext("2d");
// Переменные
let chart = null;
let pauseMode = false;
// Функции
const getBarColor = (nowValue, previousValue) => {
  if (nowValue > previousValue) {
    return "rgba(107, 237, 141, 0.65)";
  } else {
    return "rgba(237, 107, 107, 0.65)";
  }
};
const onPanZoomStart = () => {
  chart.stop();
  pauseMode = true;
};
const onPanZoomComplete = () => {
  if (
    chart.config.options.scales.x.max >
    chart.getDatasetMeta(0).data.length - 5
  ) {
    pauseMode = false;
  }
};
const realTimeDemo = (xData, yData) => {
  let startI = 50;
  let xOffset = 30;
  let i = startI;
  let interval = setInterval(() => {
    if (i + xOffset > xData.length) clearInterval(interval);
    else {
      if (i === startI) {
        for (let i = startI; i < startI + xOffset; i++) {
          chart.config.data.labels.push(xData[i]);
        }
      }
      chart.config.data.labels.push(xData[i + xOffset]);
      chart.config.data.datasets[0].data.push(yData[i]);
      chart.config.data.datasets[1].data.push(yData[i] / 4);
      chart.config.data.datasets[1].backgroundColor.push(
        getBarColor(yData[i], yData[i - 1])
      );
      if (!pauseMode) {
        chart.config.options.scales.x.min++;
        chart.config.options.scales.x.max++;
        chart.update();
      }
      i++;
    }
  }, 400);
};
const createLineChart = (xData, yData) => {
  let gradient = context.createLinearGradient(0, 0, 0, window.screen.width / 2);
  gradient.addColorStop(0, "rgba(74, 169, 230, 0.8)");
  gradient.addColorStop(1, "rgba(74, 169, 230, 0.001)");
  let data = {
    labels: xData,
    datasets: [
      {
        type: "line",
        label: "Global Price of Aluminum",
        data: yData,
        pointStyle: false,
        fill: true,
        backgroundColor: "rgba(74, 169, 230, 0.0)",
        borderWidth: 2.5,
        borderColor: "rgba(74, 169, 230, 1)",
        tension: 0.2,
      },
      {
        type: "bar",
        label: "Global Price of Aluminum",
        data: yData.map((elem) => elem / 4),
        pointStyle: false,
        fill: true,
        backgroundColor: yData.map((elem, index) =>
          getBarColor(elem, yData[index - 1])
        ),
        border: false,
        tension: 0.2,
        animations: {
          x: {
            fn: (from, to, factor) => to,
          },
        },
      },
    ],
  };
  let xScaleConfig = {
    min: 0,
    max: 50,
    ticks: {
      autoSkip: true,
      maxRotation: 0,
      // minRotation: 90,
      color: "rgba(74, 169, 230, 0.9)",
    },
    border: {
      color: "rgba(74, 169, 230, 1)",
    },
    grid: {
      color: "rgba(74, 169, 230, 0.3)",
    },
  };
  let yScaleConfig = {
    ticks: {
      color: "rgba(74, 169, 230, 0.9)",
    },
    border: {
      color: "rgba(74, 169, 230, 1)",
    },
    grid: {
      color: "rgba(74, 169, 230, 0.3)",
    },
  };
  let zoomOptions = {
    limits: {
      x: {
        min: 0,
        max: 600,
        minRange: 20,
      },
    },
    pan: {
      enabled: true,
      mode: "x",
      onPanStart: onPanZoomStart,
      onPanComplete: onPanZoomComplete,
    },
    zoom: {
      mode: "x",
      pinch: {
        enabled: true,
      },
      wheel: {
        enabled: true,
      },
      onZoomStart: onPanZoomStart,
      onZoomComplete: onPanZoomComplete,
    },
  };
  let config = {
    data: data,
    options: {
      scales: {
        x: xScaleConfig,
        y: yScaleConfig,
      },
      plugins: {
        legend: {
          display: false,
        },
        zoom: zoomOptions,
        tooltip: {
          position: "nearest",
          enabled: true,
          mode: "index", // Отображает все точки на x-оси при наведении
          intersect: false, // Tooltip отображается, когда курсор близко к данным
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Фон Tooltip
          titleColor: "#fff", // Цвет заголовка
          bodyColor: "#fff", // Цвет тела Tooltip
          borderColor: "#fff", // Цвет границы Tooltip
          borderWidth: 1, // Ширина границы Tooltip
          cornerRadius: 4, // Радиус скругления углов Tooltip
          padding: 10, // Внутренний отступ Tooltip
          callbacks: {
            // Настройка содержимого Tooltip
            title: function (context) {
              let title = context[0].label;
              return `Дата: ${title}`;
            },
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                // Форматируем число как валюту
                label += new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "USD",
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
        zoom: zoomOptions,
      },
      animation: {
        duration: 400,
        easing: "linear",
        y: {
          fn: (from, to, factor) => to,
        },
      },
    },
  };
  chart = new Chart(context, config);
};
// Получение данных с сервера
axios
  .get(
    "https://www.alphavantage.co/query?function=ALUMINUM&interval=monthly&apikey=demo"
  )
  .then((response) => {
    let data = response.data.data;
    let xData = [];
    let yData = [];
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i].value !== ".") {
        xData.push(data[i].date);
        yData.push(data[i].value);
      }
    }
    let xStartData = [];
    let yStartData = [];
    let xParseData = [];
    let yParseData = [];
    for (let i = 0; i < xData.length; i++) {
      if (i < 50) {
        xStartData.push(xData[i]);
        yStartData.push(yData[i]);
      } else {
        xParseData.push(xData[i]);
        yParseData.push(yData[i]);
      }
    }
    createLineChart(xStartData, yStartData);
    realTimeDemo(xParseData, yParseData);
  });

// ОБРАБОТЧИКИ СОБЫТИЙ
// window.addEventListener('click', ()=>pauseMode = !pauseMode);
