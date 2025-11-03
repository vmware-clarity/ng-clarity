export interface BreadcrumbItem {
    label: string;
    href?: string;
    routerLink?: string;
    queryParams?: {
        [key: string]: string;
    };
    target?: string;
}
