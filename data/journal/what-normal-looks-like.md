---
title: Teaching a model what normal looks like
excerpt: Static thresholds fire on every holiday and miss every slow leak. A look at how Kairo builds baselines that move with your business.
category: Research
date: '2026-08-19'
readTime: 9 min read
cover: /images/journal-light.jpg
author:
  name: Rafael Costa
  role: Head of Machine Learning
  image: /images/team-rafael.jpg
---

The simplest anomaly detector is a threshold: alert when revenue drops below a number. It is also the most annoying one. It fires every bank holiday and stays silent while a metric slowly bleeds out.

## Baselines, not thresholds

Kairo models each metric as a combination of trend, weekly rhythm, yearly season and known events like launches or price changes. The alert is not "below X". It is "outside the range this metric would normally be in today".

## The slow leak problem

Sudden drops are easy. The expensive problems are gradual: a conversion rate that loses a tenth of a percent every week. We track the slope of the residual over several windows, so a slow drift gets flagged long before it crosses any line.

## Staying quiet

The hardest part is not detection. It is restraint. Every flagged change goes through a second check: would the owner of this metric care? If the answer is unclear, Kairo waits for more evidence.
