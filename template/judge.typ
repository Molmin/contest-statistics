= 评测统计

下面展示的是本次比赛所有组别的评测数据。

本次比赛共产生 ${{ count_submission }}$ 次提交，其中 ${{ count_submission_compile_successfully }}$ 次编译通过，${{ count_submission_ac }}$ 次答案正确，共评测了 ${{ judge_testcase_count }}$ 个测试点，忽略了 ${{ judge_testcase_ignore_count }}$ 个测试点，选手代码运行时间总计 ${{ judge_sum_time }}$ 秒。

本次比赛提交状态分布如下图所示：

#cetz.canvas({
  import cetz.chart
  import cetz.draw: *

  chart.piechart(
    (
      ([{{ count_AC }} AC], {{ rate_AC }}),
      ([{{ count_WA }} WA], {{ rate_WA }}),
      ([{{ count_TLE }} TLE], {{ rate_TLE }}),
      ([{{ count_MLE }} MLE], {{ rate_MLE }}),
      ([{{ count_RE }} RE], {{ rate_RE }}),
      ([{{ count_CE }} CE], {{ rate_CE }}),
    ),
    value-key: 1,
    label-key: 0,
    radius: 2,
    slice-style: (green, red, orange, purple, rgb(115, 192, 222), yellow),
    inner-radius: 0,
    inner-label: (content: (value, label) => [#text(str(value) + "%")], radius: 120%),
    outer-label: (content: (value, label) => [#text(black, label)], radius: 115%),
  )
})

评测量统计如下图 #footnote[红色曲线为 2024 年比赛数据，蓝色曲线为 2023 年比赛数据，下同] 所示：

#cetz.canvas(length: 1cm, {
  import cetz.plot
  let judge_count_2024 = ({{ 2024.judge_count }})
  let judge_count_2023 = ({{ 2023.judge_count }})
  plot.plot(
    size: (14, 5),
    x-label: [时间（分钟）],
    x-tick-step: 15,
    y-label: [每 10 分钟评测量（次）],
    y-tick-step: 50,
    {
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
  let judge_wait_2024 = ({{ 2024.judge_wait }})
  let judge_wait_2023 = ({{ 2023.judge_wait }})
  plot.plot(
    size: (14, 5),
    x-label: [时间（分钟）],
    x-tick-step: 15,
    y-label: [平均排队等候时间（秒）],
    y-tick-step: 25,
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
