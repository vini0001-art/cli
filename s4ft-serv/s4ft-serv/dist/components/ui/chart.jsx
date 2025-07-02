"use client";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { createContext, useContext, useId, useMemo, forwardRef, } from "react";
import { ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend, } from "recharts";
import { cn } from "@/lib/utils";
import "./chart.css"; // novo arquivo CSS externo
// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" };
const ChartContext = createContext(null);
function useChart() {
    const context = useContext(ChartContext);
    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />");
    }
    return context;
}
const ChartContainer = forwardRef((_a, ref) => {
    var { id, className, children, config } = _a, props = __rest(_a, ["id", "className", "children", "config"]);
    const uniqueId = useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
    return (<ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} ref={ref} className={cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none", className)} {...props}>
        <ChartStyle id={chartId} config={config}/>
        <ResponsiveContainer>
          {children ? children : <></>}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>);
});
ChartContainer.displayName = "Chart";
const ChartStyle = ({ id, config }) => {
    const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);
    if (!colorConfig.length) {
        return null;
    }
    return (<style dangerouslySetInnerHTML={{
            __html: Object.entries(THEMES)
                .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                .map(([key, itemConfig]) => {
                var _a;
                const color = ((_a = itemConfig.theme) === null || _a === void 0 ? void 0 : _a[theme]) || itemConfig.color;
                return color ? `  --color-${key}: ${color};` : null;
            })
                .filter(Boolean)
                .join("\n")}
}
`)
                .join(""),
        }}/>);
};
const ChartTooltip = RechartsTooltip;
const ChartTooltipContent = forwardRef((props, ref) => {
    const { active, className, indicator = "dot", hideLabel = false, hideIndicator = false, labelFormatter, labelClassName, formatter, color, nameKey, labelKey } = props, rest = __rest(props, ["active", "className", "indicator", "hideLabel", "hideIndicator", "labelFormatter", "labelClassName", "formatter", "color", "nameKey", "labelKey"]);
    const payload = props.payload; // <-- forçando acesso seguro
    const { config } = useChart();
    const tooltipLabel = useMemo(() => {
        var _a;
        if (hideLabel || !(payload && Array.isArray(payload) && payload.length)) {
            return null;
        }
        const [item] = payload;
        const key = `${labelKey || item.dataKey || item.name || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        const value = !labelKey && typeof item.label === "string"
            ? ((_a = config[item.label]) === null || _a === void 0 ? void 0 : _a.label) || item.label
            : itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.label;
        if (labelFormatter && typeof value !== "undefined") {
            return labelFormatter(value, payload);
        }
        return value;
    }, [labelFormatter, payload, hideLabel, labelKey, config]);
    if (!active || !(payload && Array.isArray(payload) && payload.length)) {
        return null;
    }
    const nestLabel = payload.length === 1 && indicator !== "dot";
    return (<div ref={ref} className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className)} {...rest}>
        {!nestLabel ? <div className={cn("font-medium", labelClassName)}>{tooltipLabel}</div> : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || (item.payload && item.payload.fill) || item.color;
            return (<div key={item.dataKey} className={cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center")}>
                {formatter && (item === null || item === void 0 ? void 0 : item.value) !== undefined && item.name ? (formatter(item.value, item.name, item, index, item.payload)) : (<>
                    {(itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.icon) ? (<itemConfig.icon />) : (!hideIndicator && (<span className={cn("chart-indicator", indicator === "dot" && "chart-indicator-dot", indicator === "line" && "chart-indicator-line", indicator === "dashed" && "chart-indicator-dashed", nestLabel && indicator === "dashed" && "chart-indicator-dashed-nest", "chart-indicator-custom" // nova classe para estilos customizados
                        )} data-bg={indicatorColor} data-border={indicatorColor}/>))}
                    <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
                      <div className="grid gap-1.5">
                        {nestLabel ? <div className={cn("font-medium", labelClassName)}>{tooltipLabel}</div> : null}
                        <div className="text-muted-foreground">{(itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.label) || item.name}</div>
                      </div>
                      {item.value && (<div className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </div>)}
                    </div>
                  </>)}
              </div>);
        })}
        </div>
      </div>);
});
ChartTooltipContent.displayName = "ChartTooltipContent";
const ChartLegend = RechartsLegend;
const ChartLegendContent = forwardRef(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();
    if (!(payload && Array.isArray(payload) && payload.length)) {
        return null;
    }
    return (<div ref={ref} className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload.map((item) => {
            const key = `${nameKey || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            return (<div key={item.value} className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}>
            {(itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.icon) && !hideIcon ? (<itemConfig.icon />) : (<span className="chart-indicator chart-indicator-dot chart-indicator-legend" style={{ "--legend-color": item.color }}/>)}
            {itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.label}
          </div>);
        })}
    </div>);
});
ChartLegendContent.displayName = "ChartLegendContent";
// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config, payload, key) {
    if (typeof payload !== "object" || payload === null) {
        return undefined;
    }
    const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
        ? payload.payload
        : undefined;
    const configLabelKey = key;
    if (key in config || (payloadPayload && configLabelKey in payloadPayload)) {
        return config[configLabelKey];
    }
    return config[key];
}
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
