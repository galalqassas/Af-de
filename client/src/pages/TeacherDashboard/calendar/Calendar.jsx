import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Paper, Stack } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}

const Calendar = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const createEventId = (() => {
    let eventGuid = 0;
    return () => String(eventGuid++);
  })();

  const handleDateSelect = async (selectInfo) => {
    const title = prompt("Please enter a title for your event:");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      try {
        const newEvent = {
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        };
        calendarApi.addEvent(newEvent);

        const response = await fetch("http://127.0.0.1:5000/session/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacher_id: 1, 
            course_id: 1, 
            session_date: selectInfo.startStr, 
            session_link: title,
          }),
        });

        if (!response.ok) throw new Error("Failed to save the session.");

        const data = await response.json();
        console.log("Session added successfully:", data.message);
      } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to save the session. Please try again.");
      }
    }
  };

  const handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  return (
    <Stack direction={"row"}>
      <Paper className="demo-app-sidebar">
        <h2 style={{ textAlign: "center" }}>
          All Events ({currentEvents.length})
        </h2>
        <ul>{currentEvents.map(renderSidebarEvent)}</ul>
      </Paper>
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable
          selectable
          selectMirror
          dayMaxEvents
          weekends={weekendsVisible}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>
    </Stack>
  );
};

export default Calendar;
