#import "@preview/bubble:0.1.0": *
#import "@preview/cetz:0.2.2"

#show: bubble.with(
  title: "第三届海亮杯比赛数据统计",
  subtitle: "第三届海亮杯信奥体验营",
  author: "Milmon",
  affiliation: "海亮初级中学",
  date: "2024 年 5 月 1 日",
  year: "2024 年",
  logo: image("logo.png"),
)

#show figure.where(
  kind: table
): set figure.caption(position: bottom)

= 总述

本数据统计是 *民间* 数据统计，*仅供参考*。本文由 Typst 生成。

本次海亮信奥体验营分为三个组别进行比赛和授课：入门组、普及组、提高组。

= 参赛选手

本次比赛共有 ${{ 2024.user_count }}$ 名选手参加 #footnote[本文所称参加，指的是至少产生一次提交的选手]，具体人数分布见下表：

#figure(
  table(
    columns: 5,
    [组别], [入门组], [普及组], [提高组], [总计],
    [2024 年], [{{ 2024_r.user_count }}], [{{ 2024_p.user_count }}], [{{ 2024_t.user_count }}], [{{ 2024.user_count }}],
    [2023 年], [{{ 2023_r.user_count }}], [{{ 2023_p.user_count }}], [{{ 2023_t.user_count }}], [{{ 2023.user_count }}],
    [增长率], [{{ 2024_r.user_grow_rate }}], [{{ 2024_p.user_grow_rate }}], [{{ 2024_t.user_grow_rate }}], [{{ 2024.user_grow_rate }}],
  ),
)
