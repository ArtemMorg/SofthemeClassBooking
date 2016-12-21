using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Enum;
using SofthemeClassBooking_BOL.Exceptions;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_DAL;

namespace SofthemeClassBooking_BLL.Implementation
{
   

    public class EventService : IEventService<IEvent>
    {
        public void Add(IEvent eventModel)
        {
            using (var context = new ClassBookingContext())
            {

                if (ServiceHelper.IsRoomBusy(eventModel))
                {
                    throw new RoomIsBusyException();
                }

                var roomCapacity = context.ClassRooms
                    .Where(c => c.Id == eventModel.ClassRoomId)
                    .Select(c => c.Capacity).FirstOrDefault();

                if (roomCapacity < 1)
                {
                    throw new RoomCapacityException();
                }

                var events = MapService.Map(eventModel);
                var userEmail = ServiceHelper.GetUserEmail(eventModel.UserId);

                context.Events.Add(events);
                context.Participants.Add(new Participants
                {
                    EventId = events.Id,
                    Email = userEmail
                });

                context.SaveChanges();
            }

        }

        

        public IEnumerable<IEvent> Get()
        {
            var eventsList = new List<IEvent>();

            using (var context = new ClassBookingContext())
            {
                var events = context.Events.ToList();
                foreach (var _event in events)
                {
                    eventsList.Add(MapService.Map(_event));
                }
            }
            return eventsList;
        }

        public IEvent Get(int id)
        {
            using (var context = new ClassBookingContext())
            {
                return MapService.Map(context.Events.Find(id));
            }
        }

        public IEnumerable<IEvent> GetByClassRoom(int id, DateTime dateEventsFrom, DateTime dateEventsTo)
        {
            var eventsInClassroom = new List<IEvent>();

            using (var context = new ClassBookingContext())
            {
                var events = context.Events
                    .Where(e => e.BeginingDate >= dateEventsFrom && e.EndingDate <= dateEventsTo &&
                           e.ClassRoomId == id)
                    .OrderBy(e => e.BeginingDate)
                    .Select(e => new EventModel()
                    {
                        Id = e.Id,
                        Title = e.Title,
                        ClassRoomId = e.ClassRoomId,
                        BeginingDate = e.BeginingDate,
                        EndingDate = e.EndingDate,
                        IsPrivate = e.IsPrivate,
                        Description = e.Description.Substring(0, EventSettings.MaxCharactersInBriefDescription)
                    })
                    .ToList();

                foreach (var eventBrief in events)
                {
                    eventsInClassroom.Add(eventBrief);
                }
            }

            return eventsInClassroom;
        }


        public IEnumerable<IEvent> GetBrief(DateTime dateEventsFrom, DateTime dateEventsTo)
        {
            var eventsList = new List<IEvent>();

            using (var context = new ClassBookingContext())
            {
                var eventsBrief = context.Events
                    .Where(e => e.BeginingDate >= dateEventsFrom && e.EndingDate <= dateEventsTo)
                    .Select(e => new EventModel()
                    {
                        Id = e.Id,
                        Title = e.Title,
                        ClassRoomId = e.ClassRoomId,
                        BeginingDate = e.BeginingDate,
                        EndingDate = e.EndingDate,
                        IsPrivate = e.IsPrivate,
                        UserId = e.UserId,
                        Description = e.Description.Substring(0, EventSettings.MaxCharactersInBriefDescription)
                    }).ToList();

                foreach (var eventBrief in eventsBrief)
                {
                    eventsList.Add(eventBrief);
                }
            }

            return eventsList;
        }

        public IEnumerable<IEvent> GetByUser(string id)
        {
            var eventsList = new List<IEvent>();
            var dateNow = DateTime.UtcNow.AddHours(EventSettings.DateTimeUtcOffset);

            using (var context = new ClassBookingContext())
            {

                var userEmail = ServiceHelper.GetUserEmail(id);

                var events = (from e in context.Events
                              join p in context.Participants on e.Id equals p.EventId
                              where e.EndingDate > dateNow && p.Email == userEmail
                              select new EventModel
                              {
                                  Id = e.Id,
                                  ClassRoomId = e.ClassRoomId,
                                  BeginingDate = e.BeginingDate,
                                  EndingDate = e.EndingDate,
                                  Title = e.Title,
                                  Description = e.Description
                              }).ToList();


                foreach (var _event in events)
                {
                    eventsList.Add(_event);
                }
            }
            return eventsList;
        }

        public void Remove(IEvent eventModel)
        {
            var events = new Events
            {
                Id = eventModel.Id
            };

            using (var context = new ClassBookingContext())
            {
                context.Participants.RemoveRange(context.Participants
                    .Where(p => p.EventId == events.Id));

                context.Events.Attach(events);
                context.Events.Remove(events);
                
                context.SaveChanges();
            }

        }

        public int GetNumberOfEventsByUser(string id)
        {

            var eventsList = new List<IEvent>();

            int count = 0;
            using (var context = new ClassBookingContext())
            {

                count = context.Events.Where(e => e.UserId == id).ToList().Count;
            }
            return count;

        }

        public void RemoveAllEventsFromUser(string id)
        {
            var eventsList = new List<IEvent>();
            var dateNow = DateTime.Now;

            using (var context = new ClassBookingContext())
            {

                var events = context.Events.Where(e => e.UserId == id).ToList();
                foreach (var _event in events)
                {
                    context.Participants.RemoveRange(context.Participants
                            .Where(p => p.EventId == _event.Id));

                    context.Events.Attach(_event);
                    context.Events.Remove(_event);
                }
                context.SaveChanges();
            }

        }

        public void Update(IEvent eventModel, IEvent pivotModel)
        {

            if (ServiceHelper.IsRoomBusy(eventModel))
            {
                throw new RoomIsBusyException();
            }

            var events = MapService.Map(eventModel);
            using (var context = new ClassBookingContext())
            {
                context.Events.Attach(events);
                context.Entry(events).State = EntityState.Modified;
                context.SaveChanges();
            }
        }


    }
}
