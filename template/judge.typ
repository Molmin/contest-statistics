= 评测统计

下面展示的是本次比赛所有组别的评测数据。

本次比赛共产生 $100$ 次提交，其中 $80$ 次编译通过，$30$ 次答案正确。

本次比赛提交状态分布如下图所示：

#cetz.canvas({
  import cetz.chart
  import cetz.draw: *

  chart.piechart(
    (
      ([100 AC], 24),
      ([30 WA], 31),
      ([40 TLE], 24),
      ([50 MLE], 31),
      ([10 RE], 31),
      ([10 CE], 31),
    ),
    value-key: 1,
    label-key: 0,
    radius: 2,
    slice-style: (green, red, orange, purple, rgb(115, 192, 222), yellow),
    inner-radius: 0,
    inner-label: (content: (value, label) => [#text(white, label)], radius: 120%),
    outer-label: (content: (value, label) => [#text(black, str(value) + "%")], radius: 115%),
  )
})

评测量统计如下图 #footnote[红色曲线为 2024 年比赛数据，蓝色曲线为 2023 年比赛数据，下同] 所示：

#cetz.canvas(length: 1cm, {
  import cetz.plot
  let judge_count_2024 = (0, 10, 20, 30, 40, 50, 60, 70, 30)
  let judge_count_2023 = (0, 5, 70, 30, 20, 40, 30, 80, 10)
  plot.plot(
    size: (14, 5),
    x-label: [时间（分钟）],
    x-tick-step: 30,
    y-label: [每 10 分钟评测量（次）],
    y-tick-step: 10,
    // y2-label: [最高分],
    // y2-tick-step: 100,
    {
      // plot.add(
      //   style: judge_count_style,
      //   domain: (0, 180),
      //   axes: ("x", "y2"),
      //   (x) => 0,
      // )
      // plot.add(
      //   style: judge_count_style,
      //   domain: (1, 2),
      //   axes: ("x", "y2"),
      //   (x) => 100,
      // )
      let i = 1
      while i <= 180 {
        plot.add(
          style: (stroke: red, fill: white),
          domain: (i - 1, i),
          (x) => {
            if i < judge_count_2024.len() { judge_count_2024.at(i) * (1 - i + x) + judge_count_2024.at(i - 1) * (i - x) }
            else { 0 }
          }
        )
        plot.add(
          style: (stroke: blue, fill: white),
          domain: (i - 1, i),
          (x) => {
            if i < judge_count_2023.len() { judge_count_2023.at(i) * (1 - i + x) + judge_count_2023.at(i - 1) * (i - x) }
            else { 0 }
          }
        )
        i += 1
      }
    }
  )
})

评测队列平均排队等候时间如下图所示：

#cetz.canvas(length: 1cm, {
  import cetz.plot
  let judge_wait_2024 = (0, 10, 20, 30, 40, 50, 60, 70, 30)
  let judge_wait_2023 = (0, 5, 70, 30, 20, 40, 30, 80, 10)
  plot.plot(
    size: (14, 5),
    x-label: [时间（分钟）],
    x-tick-step: 30,
    y-label: [平均排队等候时间（秒）],
    y-tick-step: 5,
    {
      let i = 1
      while i <= 180 {
        plot.add(
          style: (stroke: red, fill: white),
          domain: (i - 1, i),
          (x) => {
            if i < judge_wait_2024.len() { judge_wait_2024.at(i) * (1 - i + x) + judge_wait_2024.at(i - 1) * (i - x) }
            else { 0 }
          }
        )
        plot.add(
          style: (stroke: blue, fill: white),
          domain: (i - 1, i),
          (x) => {
            if i < judge_wait_2023.len() { judge_wait_2023.at(i) * (1 - i + x) + judge_wait_2023.at(i - 1) * (i - x) }
            else { 0 }
          }
        )
        i += 1
      }
    }
  )
})

#pagebreak()
