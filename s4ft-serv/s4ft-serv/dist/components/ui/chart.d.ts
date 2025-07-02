import React, { ReactNode, ComponentType } from "react";
import { Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";
import "./chart.css";
declare const THEMES: {
    readonly light: "";
    readonly dark: ".dark";
};
export type ChartConfig = {
    [k in string]: {
        label?: ReactNode;
        icon?: ComponentType;
    } & ({
        color?: string;
        theme?: never;
    } | {
        color?: never;
        theme: Record<keyof typeof THEMES, string>;
    });
};
declare const ChartContainer: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ReactNode;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartStyle: ({ id, config }: {
    id: string;
    config: ChartConfig;
}) => React.JSX.Element | null;
declare const ChartTooltip: typeof RechartsTooltip;
declare const ChartTooltipContent: React.ForwardRefExoticComponent<Omit<Omit<import("recharts").DefaultTooltipContentProps<any, any>, "label" | "viewBox" | "active" | "payload" | "coordinate" | "accessibilityLayer"> & {
    active?: boolean;
    includeHidden?: boolean | undefined;
    allowEscapeViewBox?: import("recharts/types/util/types").AllowInDimension;
    animationDuration?: import("recharts/types/util/types").AnimationDuration;
    animationEasing?: import("recharts/types/util/types").AnimationTiming;
    content?: import("recharts/types/component/Tooltip").ContentType<any, any> | undefined;
    cursor?: import("recharts/types/component/Cursor").CursorDefinition;
    filterNull?: boolean;
    defaultIndex?: number | import("recharts/types/state/tooltipSlice").TooltipIndex;
    isAnimationActive?: boolean;
    offset?: number;
    payloadUniqBy?: import("recharts/types/util/payload/getUniqPayload").UniqueOption<import("recharts/types/component/DefaultTooltipContent").Payload<any, any>> | undefined;
    portal?: HTMLElement | null;
    position?: Partial<import("recharts/types/util/types").Coordinate>;
    reverseDirection?: import("recharts/types/util/types").AllowInDimension;
    shared?: boolean;
    trigger?: import("recharts/types/chart/types").TooltipTrigger;
    useTranslate3d?: boolean;
    wrapperStyle?: React.CSSProperties;
    axisId?: import("recharts/types/state/cartesianAxisSlice").AxisId;
} & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartLegend: typeof RechartsLegend;
declare const ChartLegendContent: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    payload?: any[];
    verticalAlign?: string;
    hideIcon?: boolean;
    nameKey?: string;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
