# Task: _shadow.cssのbox-shadow定義のシンタックスバグを修正する

## 達成条件

- _shadow.cssの--shadow-strongと--shadow-strongestのシンタックスが正しいスペース区切りに修正されている

## 背景

CSS調査で発見されたバグ。`--shadow-strong`と`--shadow-strongest`がカンマ区切り(`0, 2px, 4px`)になっており、CSS box-shadowの正しいシンタックス(`0 2px 4px`)ではないため、シャドウが正しく適用されない。
