/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NO_OF_DAYS_IN_A_WEEK, NO_OF_ROWS_IN_CALENDAR_VIEW, TOTAL_DAYS_IN_DAYS_VIEW } from '../utils/constants';
import { getDay } from '../utils/date-utils';
import { DayViewModel } from './day-view.model';
import { DayModel } from './day.model';
export class CalendarViewModel {
    constructor(calendar, selectedDay, selectedEndDay, focusableDay, today, firstDayOfWeek, excludedDates) {
        this.calendar = calendar;
        this.selectedDay = selectedDay;
        this.selectedEndDay = selectedEndDay;
        this.focusableDay = focusableDay;
        this.today = today;
        this.firstDayOfWeek = firstDayOfWeek;
        this.excludedDates = excludedDates;
        this.currMonthDayViews = [];
        this.initializeCalendarView();
    }
    /**
     * DayViewModel matrix. Size 6x7
     */
    get calendarView() {
        return this._calendarView;
    }
    /**
     * Updates the focusable day in the calendar.
     */
    updateFocusableDay(day) {
        this.setFocusableFlag(this.focusableDay, false);
        this.setFocusableFlag(day, true);
        this.focusableDay = day;
    }
    /**
     * Updates the selected day in the calendar
     */
    updateSelectedDay(day) {
        this.setSelectedDay(this.selectedDay, false);
        this.selectedDay = day;
        this.setSelectedDay(day, true);
    }
    /**
     * Updates the selected end day in the calendar
     */
    updateSelectedEndDay(day) {
        this.setSelectedDay(this.selectedEndDay, false);
        this.selectedEndDay = day;
        this.setSelectedDay(day, true);
    }
    /**
     * Generates a 6x7 matrix of DayViewModel based on the Calendar.
     * The 6x7 matrix is structured according to the first day of the week.
     * 6 rows to accommodate months which might have dates spanning over 6 weeks.
     * 7 columns because there are 7 days in a week :P :D
     */
    initializeCalendarView() {
        // Generate prev and next month calendar models.
        const prevMonthCalendar = this.calendar.previousMonth();
        const nextMonthCalendar = this.calendar.nextMonth();
        // Get no of days from prev and next months.
        const daysFromPrevMonthInCalView = this.numDaysFromPrevMonthInCalView(this.calendar.year, this.calendar.month);
        const daysFromNextMonthInCalView = TOTAL_DAYS_IN_DAYS_VIEW - (this.calendar.days.length + daysFromPrevMonthInCalView);
        // Generate prev, curr and next day view models
        let prevMonthDayViews = [];
        let nextMonthDayViews = [];
        if (daysFromPrevMonthInCalView > 0) {
            prevMonthDayViews = this.generateDayViewModels(prevMonthCalendar.days.slice(-1 * daysFromPrevMonthInCalView), true, false);
        }
        this.currMonthDayViews = this.generateDayViewModels(this.calendar.days, false, true);
        if (daysFromNextMonthInCalView > 0) {
            nextMonthDayViews = this.generateDayViewModels(nextMonthCalendar.days.slice(0, daysFromNextMonthInCalView), true, false);
        }
        // Generate calendar view and initialize flags
        this._calendarView = this.generateCalendarView(prevMonthDayViews, this.currMonthDayViews, nextMonthDayViews);
        this.initializeSelectedDay();
        this.initializeFocusableDay();
    }
    isDateExcluded(date) {
        const { minDate, maxDate } = this.excludedDates;
        const from = minDate.toComparisonString();
        const to = maxDate.toComparisonString();
        const today = date.toComparisonString();
        return !(today >= from && today <= to);
    }
    /**
     * Generates a DayViewModel array based on the DayModel passed
     */
    generateDayViewModels(days, isExcluded, isCurrentCalendar) {
        const dayViews = days.map(day => {
            return new DayViewModel(day, false, isExcluded, this.isDateExcluded(day), false, false);
        });
        if (isCurrentCalendar && this.calendar.isDayInCalendar(this.today)) {
            dayViews[this.today.date - 1].isTodaysDate = true;
        }
        return dayViews;
    }
    /**
     * Gets the first day of the current month to figure out how many dates of previous month
     * are needed to complete the Calendar View based on the first day of the week.
     * eg: Assuming locale en-US, the first day of the week is Sunday,
     * if first day of the current month lands on Wednesday, then
     * (this.getDay function would return 3 since
     * first day of the week is 0), we need the 3 days from the previous month.
     */
    numDaysFromPrevMonthInCalView(currentYear, currentMonth) {
        const firstDayOfCurrMonth = getDay(currentYear, currentMonth, 1);
        if (firstDayOfCurrMonth >= this.firstDayOfWeek) {
            return firstDayOfCurrMonth - this.firstDayOfWeek;
        }
        else {
            return NO_OF_DAYS_IN_A_WEEK + firstDayOfCurrMonth - this.firstDayOfWeek;
        }
    }
    /**
     * Checks if the Day passed is in the CalendarView.
     */
    isDayInCalendarView(day) {
        if (!this.calendar.isDayInCalendar(day)) {
            return false;
        }
        return true;
    }
    /**
     * Using the DayViewModels from the previous, current and next month, this function
     * generates the CalendarView.
     */
    generateCalendarView(prev, curr, next) {
        const combinationArr = [...prev, ...curr, ...next];
        const calendarView = [];
        for (let i = 0; i < NO_OF_ROWS_IN_CALENDAR_VIEW; i++) {
            calendarView[i] = combinationArr.slice(i * NO_OF_DAYS_IN_A_WEEK, (i + 1) * NO_OF_DAYS_IN_A_WEEK);
        }
        return calendarView;
    }
    /**
     * Initialize the selected day if the day is in the calendar.
     */
    initializeSelectedDay() {
        this.setSelectedDay(this.selectedDay, true);
        this.setSelectedDay(this.selectedEndDay, true);
    }
    /**
     * Initializes the focusable day if the day is in the calendar. If focusable day is not set, then
     * we check for the selected day. If selected day is not set then check if today is in the current
     * calendar. If not then just set the 15th of the current calendar month.
     */
    initializeFocusableDay() {
        if (this.focusableDay && this.isDayInCalendarView(this.focusableDay)) {
            this.setFocusableFlag(this.focusableDay, true);
        }
        else if (this.selectedDay && this.isDayInCalendarView(this.selectedDay)) {
            this.setFocusableFlag(this.selectedDay, true);
            this.focusableDay = this.selectedDay.clone();
        }
        else if (this.selectedEndDay && this.isDayInCalendarView(this.selectedEndDay)) {
            this.setFocusableFlag(this.selectedEndDay, true);
            this.focusableDay = this.selectedEndDay.clone();
        }
        else if (this.isDayInCalendarView(this.today)) {
            this.setFocusableFlag(this.today, true);
            this.focusableDay = this.today.clone();
        }
        else {
            this.focusableDay = new DayModel(this.calendar.year, this.calendar.month, 15);
            this.setFocusableFlag(this.focusableDay, true);
        }
    }
    setFocusableFlag(day, flag) {
        if (day) {
            this.currMonthDayViews[day.date - 1].isFocusable = flag;
        }
    }
    setSelectedDay(day, flag) {
        if (day && this.isDayInCalendarView(day)) {
            this.currMonthDayViews[day?.date - 1].isSelected = flag;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItdmlldy5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2RhdGVwaWNrZXIvbW9kZWwvY2FsZW5kYXItdmlldy5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUdILE9BQU8sRUFBRSxvQkFBb0IsRUFBRSwyQkFBMkIsRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV2QyxNQUFNLE9BQU8saUJBQWlCO0lBSTVCLFlBQ1MsUUFBdUIsRUFDdkIsV0FBcUIsRUFDckIsY0FBd0IsRUFDdkIsWUFBc0IsRUFDdEIsS0FBZSxFQUNoQixjQUFzQixFQUNyQixhQUF3QjtRQU56QixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLGdCQUFXLEdBQVgsV0FBVyxDQUFVO1FBQ3JCLG1CQUFjLEdBQWQsY0FBYyxDQUFVO1FBQ3ZCLGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQ3RCLFVBQUssR0FBTCxLQUFLLENBQVU7UUFDaEIsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFDckIsa0JBQWEsR0FBYixhQUFhLENBQVc7UUFWMUIsc0JBQWlCLEdBQW1CLEVBQUUsQ0FBQztRQVk3QyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsa0JBQWtCLENBQUMsR0FBYTtRQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFD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RyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3pEO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEYXRlUmFuZ2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2RhdGUtcmFuZ2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IE5PX09GX0RBWVNfSU5fQV9XRUVLLCBOT19PRl9ST1dTX0lOX0NBTEVOREFSX1ZJRVcsIFRPVEFMX0RBWVNfSU5fREFZU19WSUVXIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7IGdldERheSB9IGZyb20gJy4uL3V0aWxzL2RhdGUtdXRpbHMnO1xuaW1wb3J0IHsgQ2FsZW5kYXJNb2RlbCB9IGZyb20gJy4vY2FsZW5kYXIubW9kZWwnO1xuaW1wb3J0IHsgRGF5Vmlld01vZGVsIH0gZnJvbSAnLi9kYXktdmlldy5tb2RlbCc7XG5pbXBvcnQgeyBEYXlNb2RlbCB9IGZyb20gJy4vZGF5Lm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIENhbGVuZGFyVmlld01vZGVsIHtcbiAgcHJpdmF0ZSBjdXJyTW9udGhEYXlWaWV3czogRGF5Vmlld01vZGVsW10gPSBbXTtcbiAgcHJpdmF0ZSBfY2FsZW5kYXJWaWV3OiBEYXlWaWV3TW9kZWxbXVtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjYWxlbmRhcjogQ2FsZW5kYXJNb2RlbCxcbiAgICBwdWJsaWMgc2VsZWN0ZWREYXk6IERheU1vZGVsLFxuICAgIHB1YmxpYyBzZWxlY3RlZEVuZERheTogRGF5TW9kZWwsXG4gICAgcHJpdmF0ZSBmb2N1c2FibGVEYXk6IERheU1vZGVsLFxuICAgIHByaXZhdGUgdG9kYXk6IERheU1vZGVsLFxuICAgIHB1YmxpYyBmaXJzdERheU9mV2VlazogbnVtYmVyLFxuICAgIHByaXZhdGUgZXhjbHVkZWREYXRlczogRGF0ZVJhbmdlXG4gICkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNhbGVuZGFyVmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIERheVZpZXdNb2RlbCBtYXRyaXguIFNpemUgNng3XG4gICAqL1xuICBnZXQgY2FsZW5kYXJWaWV3KCk6IERheVZpZXdNb2RlbFtdW10ge1xuICAgIHJldHVybiB0aGlzLl9jYWxlbmRhclZpZXc7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZm9jdXNhYmxlIGRheSBpbiB0aGUgY2FsZW5kYXIuXG4gICAqL1xuICB1cGRhdGVGb2N1c2FibGVEYXkoZGF5OiBEYXlNb2RlbCk6IHZvaWQge1xuICAgIHRoaXMuc2V0Rm9jdXNhYmxlRmxhZyh0aGlzLmZvY3VzYWJsZURheSwgZmFsc2UpO1xuICAgIHRoaXMuc2V0Rm9jdXNhYmxlRmxhZyhkYXksIHRydWUpO1xuICAgIHRoaXMuZm9jdXNhYmxlRGF5ID0gZGF5O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHNlbGVjdGVkIGRheSBpbiB0aGUgY2FsZW5kYXJcbiAgICovXG4gIHVwZGF0ZVNlbGVjdGVkRGF5KGRheTogRGF5TW9kZWwgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLnNldFNlbGVjdGVkRGF5KHRoaXMuc2VsZWN0ZWREYXksIGZhbHNlKTtcbiAgICB0aGlzLnNlbGVjdGVkRGF5ID0gZGF5O1xuICAgIHRoaXMuc2V0U2VsZWN0ZWREYXkoZGF5LCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzZWxlY3RlZCBlbmQgZGF5IGluIHRoZSBjYWxlbmRhclxuICAgKi9cbiAgdXBkYXRlU2VsZWN0ZWRFbmREYXkoZGF5OiBEYXlNb2RlbCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHRoaXMuc2V0U2VsZWN0ZWREYXkodGhpcy5zZWxlY3RlZEVuZERheSwgZmFsc2UpO1xuICAgIHRoaXMuc2VsZWN0ZWRFbmREYXkgPSBkYXk7XG4gICAgdGhpcy5zZXRTZWxlY3RlZERheShkYXksIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIDZ4NyBtYXRyaXggb2YgRGF5Vmlld01vZGVsIGJhc2VkIG9uIHRoZSBDYWxlbmRhci5cbiAgICogVGhlIDZ4NyBtYXRyaXggaXMgc3RydWN0dXJlZCBhY2NvcmRpbmcgdG8gdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICogNiByb3dzIHRvIGFjY29tbW9kYXRlIG1vbnRocyB3aGljaCBtaWdodCBoYXZlIGRhdGVzIHNwYW5uaW5nIG92ZXIgNiB3ZWVrcy5cbiAgICogNyBjb2x1bW5zIGJlY2F1c2UgdGhlcmUgYXJlIDcgZGF5cyBpbiBhIHdlZWsgOlAgOkRcbiAgICovXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUNhbGVuZGFyVmlldygpOiB2b2lkIHtcbiAgICAvLyBHZW5lcmF0ZSBwcmV2IGFuZCBuZXh0IG1vbnRoIGNhbGVuZGFyIG1vZGVscy5cbiAgICBjb25zdCBwcmV2TW9udGhDYWxlbmRhcjogQ2FsZW5kYXJNb2RlbCA9IHRoaXMuY2FsZW5kYXIucHJldmlvdXNNb250aCgpO1xuICAgIGNvbnN0IG5leHRNb250aENhbGVuZGFyOiBDYWxlbmRhck1vZGVsID0gdGhpcy5jYWxlbmRhci5uZXh0TW9udGgoKTtcblxuICAgIC8vIEdldCBubyBvZiBkYXlzIGZyb20gcHJldiBhbmQgbmV4dCBtb250aHMuXG4gICAgY29uc3QgZGF5c0Zyb21QcmV2TW9udGhJbkNhbFZpZXc6IG51bWJlciA9IHRoaXMubnVtRGF5c0Zyb21QcmV2TW9udGhJbkNhbFZpZXcoXG4gICAgICB0aGlzLmNhbGVuZGFyLnllYXIsXG4gICAgICB0aGlzLmNhbGVuZGFyLm1vbnRoXG4gICAgKTtcbiAgICBjb25zdCBkYXlzRnJvbU5leHRNb250aEluQ2FsVmlldzogbnVtYmVyID1cbiAgICAgIFRPVEFMX0RBWVNfSU5fREFZU19WSUVXIC0gKHRoaXMuY2FsZW5kYXIuZGF5cy5sZW5ndGggKyBkYXlzRnJvbVByZXZNb250aEluQ2FsVmlldyk7XG5cbiAgICAvLyBHZW5lcmF0ZSBwcmV2LCBjdXJyIGFuZCBuZXh0IGRheSB2aWV3IG1vZGVsc1xuICAgIGxldCBwcmV2TW9udGhEYXlWaWV3czogRGF5Vmlld01vZGVsW10gPSBbXTtcbiAgICBsZXQgbmV4dE1vbnRoRGF5Vmlld3M6IERheVZpZXdNb2RlbFtdID0gW107XG5cbiAgICBpZiAoZGF5c0Zyb21QcmV2TW9udGhJbkNhbFZpZXcgPiAwKSB7XG4gICAgICBwcmV2TW9udGhEYXlWaWV3cyA9IHRoaXMuZ2VuZXJhdGVEYXlWaWV3TW9kZWxzKFxuICAgICAgICBwcmV2TW9udGhDYWxlbmRhci5kYXlzLnNsaWNlKC0xICogZGF5c0Zyb21QcmV2TW9udGhJbkNhbFZpZXcpLFxuICAgICAgICB0cnVlLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJNb250aERheVZpZXdzID0gdGhpcy5nZW5lcmF0ZURheVZpZXdNb2RlbHModGhpcy5jYWxlbmRhci5kYXlzLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICBpZiAoZGF5c0Zyb21OZXh0TW9udGhJbkNhbFZpZXcgPiAwKSB7XG4gICAgICBuZXh0TW9udGhEYXlWaWV3cyA9IHRoaXMuZ2VuZXJhdGVEYXlWaWV3TW9kZWxzKFxuICAgICAgICBuZXh0TW9udGhDYWxlbmRhci5kYXlzLnNsaWNlKDAsIGRheXNGcm9tTmV4dE1vbnRoSW5DYWxWaWV3KSxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhdGUgY2FsZW5kYXIgdmlldyBhbmQgaW5pdGlhbGl6ZSBmbGFnc1xuICAgIHRoaXMuX2NhbGVuZGFyVmlldyA9IHRoaXMuZ2VuZXJhdGVDYWxlbmRhclZpZXcocHJldk1vbnRoRGF5Vmlld3MsIHRoaXMuY3Vyck1vbnRoRGF5Vmlld3MsIG5leHRNb250aERheVZpZXdzKTtcbiAgICB0aGlzLmluaXRpYWxpemVTZWxlY3RlZERheSgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUZvY3VzYWJsZURheSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0RhdGVFeGNsdWRlZChkYXRlOiBEYXlNb2RlbCkge1xuICAgIGNvbnN0IHsgbWluRGF0ZSwgbWF4RGF0ZSB9OiBEYXRlUmFuZ2UgPSB0aGlzLmV4Y2x1ZGVkRGF0ZXM7XG4gICAgY29uc3QgZnJvbSA9IG1pbkRhdGUudG9Db21wYXJpc29uU3RyaW5nKCk7XG4gICAgY29uc3QgdG8gPSBtYXhEYXRlLnRvQ29tcGFyaXNvblN0cmluZygpO1xuICAgIGNvbnN0IHRvZGF5ID0gZGF0ZS50b0NvbXBhcmlzb25TdHJpbmcoKTtcblxuICAgIHJldHVybiAhKHRvZGF5ID49IGZyb20gJiYgdG9kYXkgPD0gdG8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIERheVZpZXdNb2RlbCBhcnJheSBiYXNlZCBvbiB0aGUgRGF5TW9kZWwgcGFzc2VkXG4gICAqL1xuICBwcml2YXRlIGdlbmVyYXRlRGF5Vmlld01vZGVscyhkYXlzOiBEYXlNb2RlbFtdLCBpc0V4Y2x1ZGVkOiBib29sZWFuLCBpc0N1cnJlbnRDYWxlbmRhcjogYm9vbGVhbik6IERheVZpZXdNb2RlbFtdIHtcbiAgICBjb25zdCBkYXlWaWV3czogRGF5Vmlld01vZGVsW10gPSBkYXlzLm1hcChkYXkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBEYXlWaWV3TW9kZWwoZGF5LCBmYWxzZSwgaXNFeGNsdWRlZCwgdGhpcy5pc0RhdGVFeGNsdWRlZChkYXkpLCBmYWxzZSwgZmFsc2UpO1xuICAgIH0pO1xuICAgIGlmIChpc0N1cnJlbnRDYWxlbmRhciAmJiB0aGlzLmNhbGVuZGFyLmlzRGF5SW5DYWxlbmRhcih0aGlzLnRvZGF5KSkge1xuICAgICAgZGF5Vmlld3NbdGhpcy50b2RheS5kYXRlIC0gMV0uaXNUb2RheXNEYXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGRheVZpZXdzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGZpcnN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCB0byBmaWd1cmUgb3V0IGhvdyBtYW55IGRhdGVzIG9mIHByZXZpb3VzIG1vbnRoXG4gICAqIGFyZSBuZWVkZWQgdG8gY29tcGxldGUgdGhlIENhbGVuZGFyIFZpZXcgYmFzZWQgb24gdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICogZWc6IEFzc3VtaW5nIGxvY2FsZSBlbi1VUywgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2VlayBpcyBTdW5kYXksXG4gICAqIGlmIGZpcnN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCBsYW5kcyBvbiBXZWRuZXNkYXksIHRoZW5cbiAgICogKHRoaXMuZ2V0RGF5IGZ1bmN0aW9uIHdvdWxkIHJldHVybiAzIHNpbmNlXG4gICAqIGZpcnN0IGRheSBvZiB0aGUgd2VlayBpcyAwKSwgd2UgbmVlZCB0aGUgMyBkYXlzIGZyb20gdGhlIHByZXZpb3VzIG1vbnRoLlxuICAgKi9cbiAgcHJpdmF0ZSBudW1EYXlzRnJvbVByZXZNb250aEluQ2FsVmlldyhjdXJyZW50WWVhcjogbnVtYmVyLCBjdXJyZW50TW9udGg6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgZmlyc3REYXlPZkN1cnJNb250aDogbnVtYmVyID0gZ2V0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuXG4gICAgaWYgKGZpcnN0RGF5T2ZDdXJyTW9udGggPj0gdGhpcy5maXJzdERheU9mV2Vlaykge1xuICAgICAgcmV0dXJuIGZpcnN0RGF5T2ZDdXJyTW9udGggLSB0aGlzLmZpcnN0RGF5T2ZXZWVrO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTk9fT0ZfREFZU19JTl9BX1dFRUsgKyBmaXJzdERheU9mQ3Vyck1vbnRoIC0gdGhpcy5maXJzdERheU9mV2VlaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBEYXkgcGFzc2VkIGlzIGluIHRoZSBDYWxlbmRhclZpZXcuXG4gICAqL1xuICBwcml2YXRlIGlzRGF5SW5DYWxlbmRhclZpZXcoZGF5OiBEYXlNb2RlbCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5jYWxlbmRhci5pc0RheUluQ2FsZW5kYXIoZGF5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2luZyB0aGUgRGF5Vmlld01vZGVscyBmcm9tIHRoZSBwcmV2aW91cywgY3VycmVudCBhbmQgbmV4dCBtb250aCwgdGhpcyBmdW5jdGlvblxuICAgKiBnZW5lcmF0ZXMgdGhlIENhbGVuZGFyVmlldy5cbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVDYWxlbmRhclZpZXcocHJldjogRGF5Vmlld01vZGVsW10sIGN1cnI6IERheVZpZXdNb2RlbFtdLCBuZXh0OiBEYXlWaWV3TW9kZWxbXSk6IERheVZpZXdNb2RlbFtdW10ge1xuICAgIGNvbnN0IGNvbWJpbmF0aW9uQXJyOiBEYXlWaWV3TW9kZWxbXSA9IFsuLi5wcmV2LCAuLi5jdXJyLCAuLi5uZXh0XTtcblxuICAgIGNvbnN0IGNhbGVuZGFyVmlldzogRGF5Vmlld01vZGVsW11bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTk9fT0ZfUk9XU19JTl9DQUxFTkRBUl9WSUVXOyBpKyspIHtcbiAgICAgIGNhbGVuZGFyVmlld1tpXSA9IGNvbWJpbmF0aW9uQXJyLnNsaWNlKGkgKiBOT19PRl9EQVlTX0lOX0FfV0VFSywgKGkgKyAxKSAqIE5PX09GX0RBWVNfSU5fQV9XRUVLKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGVuZGFyVmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZWxlY3RlZCBkYXkgaWYgdGhlIGRheSBpcyBpbiB0aGUgY2FsZW5kYXIuXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVTZWxlY3RlZERheSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldFNlbGVjdGVkRGF5KHRoaXMuc2VsZWN0ZWREYXksIHRydWUpO1xuICAgIHRoaXMuc2V0U2VsZWN0ZWREYXkodGhpcy5zZWxlY3RlZEVuZERheSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGZvY3VzYWJsZSBkYXkgaWYgdGhlIGRheSBpcyBpbiB0aGUgY2FsZW5kYXIuIElmIGZvY3VzYWJsZSBkYXkgaXMgbm90IHNldCwgdGhlblxuICAgKiB3ZSBjaGVjayBmb3IgdGhlIHNlbGVjdGVkIGRheS4gSWYgc2VsZWN0ZWQgZGF5IGlzIG5vdCBzZXQgdGhlbiBjaGVjayBpZiB0b2RheSBpcyBpbiB0aGUgY3VycmVudFxuICAgKiBjYWxlbmRhci4gSWYgbm90IHRoZW4ganVzdCBzZXQgdGhlIDE1dGggb2YgdGhlIGN1cnJlbnQgY2FsZW5kYXIgbW9udGguXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVGb2N1c2FibGVEYXkoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9jdXNhYmxlRGF5ICYmIHRoaXMuaXNEYXlJbkNhbGVuZGFyVmlldyh0aGlzLmZvY3VzYWJsZURheSkpIHtcbiAgICAgIHRoaXMuc2V0Rm9jdXNhYmxlRmxhZyh0aGlzLmZvY3VzYWJsZURheSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkRGF5ICYmIHRoaXMuaXNEYXlJbkNhbGVuZGFyVmlldyh0aGlzLnNlbGVjdGVkRGF5KSkge1xuICAgICAgdGhpcy5zZXRGb2N1c2FibGVGbGFnKHRoaXMuc2VsZWN0ZWREYXksIHRydWUpO1xuICAgICAgdGhpcy5mb2N1c2FibGVEYXkgPSB0aGlzLnNlbGVjdGVkRGF5LmNsb25lKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkRW5kRGF5ICYmIHRoaXMuaXNEYXlJbkNhbGVuZGFyVmlldyh0aGlzLnNlbGVjdGVkRW5kRGF5KSkge1xuICAgICAgdGhpcy5zZXRGb2N1c2FibGVGbGFnKHRoaXMuc2VsZWN0ZWRFbmREYXksIHRydWUpO1xuICAgICAgdGhpcy5mb2N1c2FibGVEYXkgPSB0aGlzLnNlbGVjdGVkRW5kRGF5LmNsb25lKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGF5SW5DYWxlbmRhclZpZXcodGhpcy50b2RheSkpIHtcbiAgICAgIHRoaXMuc2V0Rm9jdXNhYmxlRmxhZyh0aGlzLnRvZGF5LCB0cnVlKTtcbiAgICAgIHRoaXMuZm9jdXNhYmxlRGF5ID0gdGhpcy50b2RheS5jbG9uZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvY3VzYWJsZURheSA9IG5ldyBEYXlNb2RlbCh0aGlzLmNhbGVuZGFyLnllYXIsIHRoaXMuY2FsZW5kYXIubW9udGgsIDE1KTtcbiAgICAgIHRoaXMuc2V0Rm9jdXNhYmxlRmxhZyh0aGlzLmZvY3VzYWJsZURheSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRGb2N1c2FibGVGbGFnKGRheTogRGF5TW9kZWwsIGZsYWc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoZGF5KSB7XG4gICAgICB0aGlzLmN1cnJNb250aERheVZpZXdzW2RheS5kYXRlIC0gMV0uaXNGb2N1c2FibGUgPSBmbGFnO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0U2VsZWN0ZWREYXkoZGF5OiBEYXlNb2RlbCwgZmxhZzogYm9vbGVhbikge1xuICAgIGlmIChkYXkgJiYgdGhpcy5pc0RheUluQ2FsZW5kYXJWaWV3KGRheSkpIHtcbiAgICAgIHRoaXMuY3Vyck1vbnRoRGF5Vmlld3NbZGF5Py5kYXRlIC0gMV0uaXNTZWxlY3RlZCA9IGZsYWc7XG4gICAgfVxuICB9XG59XG4iXX0=