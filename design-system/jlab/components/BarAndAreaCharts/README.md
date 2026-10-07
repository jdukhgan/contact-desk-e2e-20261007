# BarAndAreaCharts

Bars for counts per period, stacked area for parts of a total over time. Same rules as the line chart: unit, scale, range, labelled axes. No pie or donut charts.

## Line, bar, stacked area chart

- **Build with:** shadcn `chart` (Recharts)
- **Rules:** `chart-1..5`; axis ticks 11 px mono `subtle-foreground`; gridlines `border`; thresholds dashed `warning` with legend label; crosshair tooltip on `popover`; drag to zoom
- **Keyboard:** Arrows move crosshair

## Tokens used

`line`, `series-1`, `series-2`, `series-3`, `text-2`, `text-3`
