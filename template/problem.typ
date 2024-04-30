== {{ problem_id }}. {{ problem_title }} 数据统计

本题满分为 {{ full_score }}，共有 {{ user_count }} 人产生了代码总长为 {{ code_length }} KiB 的 {{ submission_count }} 次提交，其中有 {{ compile_successfully }} 次编译通过，{{ accepted_count }} 人通过了此题。

本题 AC 率为 {{ ac_rate }}%，一次 AC 率为 {{ once_ac_rate }}%，得分率为 {{ get_score_rate }}%，平均分为 {{ average_score }} 分，最高分为 {{ max_score }} 分。

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

提交次数排行榜：

#figure(
  table(
    columns: 3,
    [排名], [选手], [提交次数],
{{ submission_count_ranking }}
  ),
)

代码长度排行榜：

#figure(
  table(
    columns: 3,
    [排名], [选手], [代码长度],
{{ code_length_ranking }}
  ),
)

最优解排行榜：

#figure(
  table(
    columns: 4,
    [排名], [选手], [程序耗时], [峰值内存],
{{ best_algo_ranking }}
  ),
)
