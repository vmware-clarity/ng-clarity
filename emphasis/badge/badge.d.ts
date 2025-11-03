export declare enum ClrBadgeColors {
    None = "",
    Info = "info",
    Warning = "warning",
    Danger = "danger",
    Success = "success",
    Gray = "gray",
    Blue = "blue",
    LightBlue = "light-blue",
    Orange = "orange",
    Purple = "purple"
}
export declare class ClrBadge {
    color: ClrBadgeColors | string;
    get colorClass(): string;
}
