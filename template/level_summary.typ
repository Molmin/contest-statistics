= {{ level_name }}组数据统计

{{ level_name }}组的比赛时长 {{ contest_time_length_hour }} 小时，其中共有 ${{ level_problems_count }}$ 道试题，共 ${{ user_count }}$ 名选手产生了代码总长为 ${{ submission_code_length }}$ MiB 的 ${{ submission_count }}$ 次提交，其中 ${{ count_submission_compile_successfully }}$ 次编译通过，${{ count_submission_ac }}$ 次答案正确，共评测了 ${{ judge_testcase_count }}$ 个测试点，忽略了 ${{ judge_testcase_ignore_count }}$ 个测试点，选手代码运行时间总计 ${{ judge_sum_time }}$ 小时，最高分为选手 {{ best_user }} 的 {{ max_score_value }} 分，平均分为 {{ average_score_value }} 分。

最终前十名的选手如下表：

#figure(
  table(
    columns: 3,
    [排名], [选手], [总分],
{{ ranking }}
  ),
)

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
    radius: 2.8,
    slice-style: (green, red, orange, purple, rgb(115, 192, 222), yellow),
    inner-radius: 0,
    inner-label: (content: (value, label) => [#text(str(value) + "%")], radius: 120%),
    outer-label: (content: (value, label) => [#text(black, label)], radius: 115%),
  )
})

平均分和最高分 #footnote[图中红色表示最高分，蓝色表示平均分] 变化趋势如下图所示：

#cetz.canvas(length: 1cm, {
  import cetz.plot
  let average_score = ({{ average_score }})
  let max_score = ({{ max_score }})
  plot.plot(
    size: (14, 5),
    x-label: [时间（分钟）],
    x-tick-step: 15,
    y-label: [分数],
    y-tick-step: 100,
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

各分数段人数分布见下表：

#figure(
  table(
    columns: 4,
    [分数段], [首个达到选手], [首个达到时间], [达到人数],
{{ score_distribution }}
  ),
)

总提交次数排名见下表：

#figure(
  table(
    columns: 3,
    [排名], [选手], [提交次数],
{{ submission_count_ranking }}
  ),
)

总代码长度排名见下表：

#figure(
  table(
    columns: 3,
    [排名], [选手], [总代码长度],
{{ submission_code_length_ranking }}
  ),
)

各题通过情况见下表：

#figure(
  table(
    columns: 9,
    [编号], [满分], [标题], [AC], [AC 率], [一次 AC 率], [得分率], [平均], [最高],
{{ problem_datas }}
  ),
)
