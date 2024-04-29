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
