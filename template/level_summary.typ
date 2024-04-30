= {{ level_name }}组数据统计

在{{ level_name }}组的比赛中共有 ${{ level_problems_count }}$ 道试题，共 ${{ user_count }}$ 名选手产生了 {{ submission_count }} 次提交，其中 ${{ count_submission_compile_successfully }}$ 次编译通过，${{ count_submission_ac }}$ 次答案正确，共评测了 ${{ judge_testcase_count }}$ 个测试点，忽略了 ${{ judge_testcase_ignore_count }}$ 个测试点，选手代码运行时间总计 ${{ judge_sum_time }}$ 秒。

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

平均分和最高分变化趋势如下图所示：

#cetz.canvas(length: 1cm, {
  import cetz.plot
  let average_score = ({{ average_score }})
  let max_score = ({{ max_score }})
  plot.plot(
    size: (14, 5),
    x-label: [时间（分钟）],
    x-tick-step: 15,
    y-label: [最高分],
    y-tick-step: 100,
    y2-label: [平均分],
    y2-tick-step: 100,
    {
      let i = 1
      while i <= {{ contest_time_length }} {
        plot.add(
          style: (stroke: red, fill: white),
          domain: (i - 1, i),
          (x) => {
            if i < max_score.len() { max_score.at(i) * (1 - i + x) + max_score.at(i - 1) * (i - x) }
            else { 0 }
          }
        )
        plot.add(
          style: (stroke: blue, fill: white),
          domain: (i - 1, i),
          axes: ("x", "y2"),
          (x) => {
            if i < average_score.len() { average_score.at(i) * (1 - i + x) + average_score.at(i - 1) * (i - x) }
            else { 0 }
          }
        )
        i += 1
      }
    }
  )
})
