<script>
    import dayjs from "dayjs";
    import weekday from "dayjs/plugin/weekday";
    import weekOfYear from "dayjs/plugin/weekOfYear";

    import db from '$lib/db';

    import {onMount} from "svelte";
    import Todo from "$lib/components/calendartodo/Todo.svelte";

    // export async function load({session}){
    // if (!session.authenticated) return { status: 401 };
    // db.auth.setAuth(session.access_token);
    // createCalendar();
    // }

    let todos = [];
    onMount(async () => {
        const { data, error } = await db.from('todos').select('*');
        if (error) {
            console.log(error)
        } else {
        todos = data
        };
    })

    const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    
    dayjs.extend(weekday);
    dayjs.extend(weekOfYear);
    const TODAY = dayjs().format("YYYY-MM-DD");

    const INITIAL_YEAR = dayjs().format("YYYY");
    const INITIAL_MONTH = dayjs().format("M");

    function getNumberOfDaysInMonth(year, month) {
        return dayjs(`${year}-${month}-01`).daysInMonth();
    };

    // function createDaysForCurrentMonth(year, month) {
    //     return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
    //         return {
    //             date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
    //             dayOfMonth: index + 1,
    //             isCurrentMonth: true
    //         };
    //     });
    // };

    function getWeekday(date) {
        return dayjs(date).weekday();
    };

    function createDaysForMonth(year, month, current = false) {
        return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
            let d = dayjs(`${year}-${month}-${index + 1}`)
            return {
                date: d.format("YYYY-MM-DD"),
                dayOfMonth: index + 1,
                isCurrentMonth: current,
                weekdayNr: d.format('d')
            };
        });
    }

    // function createDaysForPreviousMonth(year, month) {
        // const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);

        // const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");
  
        // // Account for first day of the month on a Sunday (firstDayOfTheMonthWeekday === 0)
        // const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6

        // const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, "day").date();

        // return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {    
        //     return {
        //         date: dayjs(
        //             `${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`
        //         ).format("YYYY-MM-DD"),
        //         dayOfMonth: previousMonthLastMondayDayOfMonth + index,
        //         isCurrentMonth: false
        //     };
        // });
    // }

    // function createDaysForNextMonth(year, month) {
    //     const lastDayOfTheMonthWeekday = getWeekday(`${year}-${month}-${currentMonthDays.length}`)

    //     const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 7 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday

    //     return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
    //         return {
    //             date: dayjs(`${year}-${Number(month) + 1}-${index + 1}`).format("YYYY-MM-DD"),
    //             dayOfMonth: index + 1,
    //             isCurrentMonth: false
    //         }
    //     })
    // }

    function removeAllDayElements(calendarDaysElement) {
        let first = calendarDaysElement.firstElementChild;

        while (first) {
            first.remove();
            first = calendarDaysElement.firstElementChild;
        }
    }

    // initMonthSelectors();

    let days = [];

    function last(array) {
        return array[array.length - 1]
    }

    function first(array) {
        return array[0]
    }

    function firstSunday(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].weekdayNr == 0) {
                return i+1;
            }
        }
    }

    function createCalendar(year = INITIAL_YEAR, month = INITIAL_MONTH) {
        dayjs(
            new Date(+year, +month - 1)
            ).format("MMMM YYYY");  

        previousMonthDays = createDaysForMonth(year, +month-1);
        previousMonthDays = last(previousMonthDays).weekdayNr != 0 ? previousMonthDays.slice(last(previousMonthDays).weekdayNr * -1) : [];
        currentMonthDays = createDaysForMonth(year, month, true);
        nextMonthDays = createDaysForMonth(year, +month+1);
        nextMonthDays = first(nextMonthDays).weekdayNr != 1 ? nextMonthDays.slice(first(nextMonthDays), firstSunday(nextMonthDays)) : [];

        days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
        // const length = previousMonthDays.length + currentMonthDays.length;
		// days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays].slice(0, 7.0 * Math.ceil(length / 7.0));
    }

    let selectedMonth = dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1));
    let currentMonthDays;
    let previousMonthDays;
    let nextMonthDays;

    const selectPreviousMonth = () => {
        selectedMonth = dayjs(selectedMonth).subtract(1, "month");
        createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    }

    const selectPresentMonth = () => {
        selectedMonth = dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1));
        createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    }
    const selectNextMonth = () => {
        selectedMonth = dayjs(selectedMonth).add(1, "month");
        createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    }

    function findTodosForDate(caldate, todos) {
        return todos.filter((todo) => dayjs(todo.date).isSame(caldate));
    }

    createCalendar()
</script>

<h1>Calendar</h1>

<div class="calendar-month">

    <section class="calendar-month-header">

        <div id="selected-month" class="calendar-month-header-selected-month">
            {selectedMonth.format("MMMM YYYY")}
        </div>

        <div class="calendar-month-header-selectors">
            <span id="previous-month-selector" on:click={selectPreviousMonth}>←</span>
            <span id="present-month-selector" on:click={selectPresentMonth}>Today</span>
            <span id="next-month-selector" on:click={selectNextMonth}>→</span>
        </div>

    </section>

    <ol id="days-of-week" class="day-of-week">
        {#each WEEKDAYS as weekday}
            <li>
                {weekday}
            </li>
        {/each}
    </ol>

    <ol id="calendar-days" class="days-grid">
        {#each days as day}
             <li class="calendar-day" class:calendar-day--not-current={!day.isCurrentMonth} class:calendar-day--today={day.date === TODAY}>
                 <span>
                     {day.dayOfMonth}
                 </span>
                 <ul class="todoslist">
                     {#each findTodosForDate(day.date, todos) || [] as todo}
                         <Todo bind:todo bind:todos></Todo>
                     {/each}
                 </ul>
             </li>
        {/each}
    </ol>

</div>

<style>
    
    ol, :global(li) {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    h1 {
        border: none;
        padding-left: 12px;
    }

    :global(.calendar-month) {
        position: relative;
        /* Color of the day cell borders */
        background-color: var(--greenmid);
        border: solid 2px var(--greendark);
    }

    /* Month indicator and selectors positioning */
    .calendar-month-header {
        display: flex;
        justify-content: space-between;
        background-color: var(--greenwhite);
        padding: 10px;
    }

    /* Month indicator */
    .calendar-month-header-selected-month {
        font-size: 24px;
        font-weight: 600;
    }

    /* Month selectors positioning */
    .calendar-month-header-selectors {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 80px;
    }

    .calendar-month-header-selectors > * {
        cursor: pointer;
    }

    /* | Mon | Tue | Wed | Thu | Fri | Sat | Sun | */
    .day-of-week {
        color: var(--grayheader);
        font-size: 18px;
        background-color: var(--greenwhite);
        border-top: solid 2px var(--greendark);
        padding-bottom: 5px;
        padding-top: 10px;
    }

    .day-of-week, .days-grid {
        /* 7 equal columns for weekdays and days cells */
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        overflow: hidden;
    }

    :global(.day-of-week > *) {
        /* Position the weekday label within the cell */
        text-align: center;
        /* padding-right: 5px; */
    }

    .days-grid {
        height: 100%;
        position: relative;
        /* Show border between the days */
        grid-column-gap: var(--grid-gap);
        grid-row-gap: var(--grid-gap);
        background-color: var(--greendark);
        border-top: solid 2px var(--greendark);
    }

    :global(.calendar-day) {
        position: relative;
        min-height: 100px;
        font-size: 16px;
        background-color: var(--greenmid);
        color: var(--grayheader);
        padding: 5px;
        
        display: flex;
        white-space: nowrap;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-direction: column;
    }

    /* Position the day label within the day cell */
    :global(.calendar-day > span) {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 2px;
        width: var(--day-label-size);
        height: var(--day-label-size);
    }

    :global(.calendar-day--not-current) {
        background-color: var(--greenfade);
        color: var(--greenmid);
    }

    :global(.calendar-day--today) {
        padding-top: 4px;
    }

    :global(.calendar-day--today > span) {
        border-radius: 9999px;
        color: var(--greenwhite);
        background-color: var(--greendark);
    }

    .todoslist {
        margin-top: 20px;
        max-width: 100%;
        padding-inline-start: 0rem;
    }
</style>