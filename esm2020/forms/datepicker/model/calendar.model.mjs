/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { getNumberOfDaysInTheMonth } from '../utils/date-utils';
import { DayModel } from './day.model';
export class CalendarModel {
    constructor(year, month) {
        this.year = year;
        this.month = month;
        this.initializeDaysInCalendar();
    }
    /**
     * Checks if the calendar passed is equal to the current calendar.
     */
    isEqual(calendar) {
        if (calendar) {
            return this.year === calendar.year && this.month === calendar.month;
        }
        return false;
    }
    /**
     * Checks if a DayModel is in the Calendar
     */
    isDayInCalendar(day) {
        if (day) {
            return this.year === day.year && this.month === day.month;
        }
        return false;
    }
    /**
     * Returns CalendarModel of the previous month.
     */
    previousMonth() {
        if (this.month === 0) {
            return new CalendarModel(this.year - 1, 11);
        }
        else {
            return new CalendarModel(this.year, this.month - 1);
        }
    }
    /**
     * Returns CalendarModel of the next month.
     */
    nextMonth() {
        if (this.month === 11) {
            return new CalendarModel(this.year + 1, 0);
        }
        else {
            return new CalendarModel(this.year, this.month + 1);
        }
    }
    /**
     * Returns CalendarModel of the previous year.
     */
    previousYear() {
        return new CalendarModel(this.year - 1, this.month);
    }
    /**
     * Returns CalendarModel of the next year.
     */
    nextYear() {
        return new CalendarModel(this.year + 1, this.month);
    }
    /**
     * Populates the days array with the DayModels in the current Calendar.
     */
    initializeDaysInCalendar() {
        const noOfDaysInCalendar = getNumberOfDaysInTheMonth(this.year, this.month);
        this.days = Array(noOfDaysInCalendar)
            .fill(null)
            .map((_date, index) => {
            return new DayModel(this.year, this.month, index + 1);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL21vZGVsL2NhbGVuZGFyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV2QyxNQUFNLE9BQU8sYUFBYTtJQUd4QixZQUFxQixJQUFZLEVBQVcsS0FBYTtRQUFwQyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVcsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUN2RCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxPQUFPLENBQUMsUUFBdUI7UUFDN0IsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDckU7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRDs7T0FFRztJQUNILGVBQWUsQ0FBQyxHQUFhO1FBQzNCLElBQUksR0FBRyxFQUFFO1lBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSCxhQUFhO1FBQ1gsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNwQixPQUFPLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzdDO2FBQU07WUFDTCxPQUFPLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRDtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNMLE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3JEO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsWUFBWTtRQUNWLE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVE7UUFDTixPQUFPLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7O09BRUc7SUFDSyx3QkFBd0I7UUFDOUIsTUFBTSxrQkFBa0IsR0FBVyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQzthQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ1YsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgZ2V0TnVtYmVyT2ZEYXlzSW5UaGVNb250aCB9IGZyb20gJy4uL3V0aWxzL2RhdGUtdXRpbHMnO1xuaW1wb3J0IHsgRGF5TW9kZWwgfSBmcm9tICcuL2RheS5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBDYWxlbmRhck1vZGVsIHtcbiAgZGF5czogRGF5TW9kZWxbXTtcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSB5ZWFyOiBudW1iZXIsIHJlYWRvbmx5IG1vbnRoOiBudW1iZXIpIHtcbiAgICB0aGlzLmluaXRpYWxpemVEYXlzSW5DYWxlbmRhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgY2FsZW5kYXIgcGFzc2VkIGlzIGVxdWFsIHRvIHRoZSBjdXJyZW50IGNhbGVuZGFyLlxuICAgKi9cbiAgaXNFcXVhbChjYWxlbmRhcjogQ2FsZW5kYXJNb2RlbCkge1xuICAgIGlmIChjYWxlbmRhcikge1xuICAgICAgcmV0dXJuIHRoaXMueWVhciA9PT0gY2FsZW5kYXIueWVhciAmJiB0aGlzLm1vbnRoID09PSBjYWxlbmRhci5tb250aDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIERheU1vZGVsIGlzIGluIHRoZSBDYWxlbmRhclxuICAgKi9cbiAgaXNEYXlJbkNhbGVuZGFyKGRheTogRGF5TW9kZWwpOiBib29sZWFuIHtcbiAgICBpZiAoZGF5KSB7XG4gICAgICByZXR1cm4gdGhpcy55ZWFyID09PSBkYXkueWVhciAmJiB0aGlzLm1vbnRoID09PSBkYXkubW9udGg7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIENhbGVuZGFyTW9kZWwgb2YgdGhlIHByZXZpb3VzIG1vbnRoLlxuICAgKi9cbiAgcHJldmlvdXNNb250aCgpOiBDYWxlbmRhck1vZGVsIHtcbiAgICBpZiAodGhpcy5tb250aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5ldyBDYWxlbmRhck1vZGVsKHRoaXMueWVhciAtIDEsIDExKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBDYWxlbmRhck1vZGVsKHRoaXMueWVhciwgdGhpcy5tb250aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIENhbGVuZGFyTW9kZWwgb2YgdGhlIG5leHQgbW9udGguXG4gICAqL1xuICBuZXh0TW9udGgoKTogQ2FsZW5kYXJNb2RlbCB7XG4gICAgaWYgKHRoaXMubW9udGggPT09IDExKSB7XG4gICAgICByZXR1cm4gbmV3IENhbGVuZGFyTW9kZWwodGhpcy55ZWFyICsgMSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgQ2FsZW5kYXJNb2RlbCh0aGlzLnllYXIsIHRoaXMubW9udGggKyAxKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBDYWxlbmRhck1vZGVsIG9mIHRoZSBwcmV2aW91cyB5ZWFyLlxuICAgKi9cbiAgcHJldmlvdXNZZWFyKCk6IENhbGVuZGFyTW9kZWwge1xuICAgIHJldHVybiBuZXcgQ2FsZW5kYXJNb2RlbCh0aGlzLnllYXIgLSAxLCB0aGlzLm1vbnRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIENhbGVuZGFyTW9kZWwgb2YgdGhlIG5leHQgeWVhci5cbiAgICovXG4gIG5leHRZZWFyKCk6IENhbGVuZGFyTW9kZWwge1xuICAgIHJldHVybiBuZXcgQ2FsZW5kYXJNb2RlbCh0aGlzLnllYXIgKyAxLCB0aGlzLm1vbnRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZXMgdGhlIGRheXMgYXJyYXkgd2l0aCB0aGUgRGF5TW9kZWxzIGluIHRoZSBjdXJyZW50IENhbGVuZGFyLlxuICAgKi9cbiAgcHJpdmF0ZSBpbml0aWFsaXplRGF5c0luQ2FsZW5kYXIoKTogdm9pZCB7XG4gICAgY29uc3Qgbm9PZkRheXNJbkNhbGVuZGFyOiBudW1iZXIgPSBnZXROdW1iZXJPZkRheXNJblRoZU1vbnRoKHRoaXMueWVhciwgdGhpcy5tb250aCk7XG4gICAgdGhpcy5kYXlzID0gQXJyYXkobm9PZkRheXNJbkNhbGVuZGFyKVxuICAgICAgLmZpbGwobnVsbClcbiAgICAgIC5tYXAoKF9kYXRlLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IERheU1vZGVsKHRoaXMueWVhciwgdGhpcy5tb250aCwgaW5kZXggKyAxKTtcbiAgICAgIH0pO1xuICB9XG59XG4iXX0=