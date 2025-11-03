export declare enum DatagridRenderStep {
    ALIGN_COLUMNS = 0,
    CALCULATE_MODE_ON = 1,
    CALCULATE_MODE_OFF = 2,
    CLEAR_WIDTHS = 3,// Note this is listened to by both cells and columns
    COMPUTE_COLUMN_WIDTHS = 4
}
