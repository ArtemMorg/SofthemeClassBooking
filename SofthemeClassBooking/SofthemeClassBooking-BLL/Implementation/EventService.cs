using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Exceptions;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_DAL;

namespace SofthemeClassBooking_BLL.Implementation
{
    public class EventService : IEventService<EventModel>
    {
        private const int maxCharactersInBriefDescription = 15;
        public void Add(EventModel eventModel)
        {
            var context = new ClassBookingContext();
            try
            {
                var eventsInSameRange = context.Events
                    .Count(e => ((e.BeginingDate >= eventModel.BeginingDate && e.BeginingDate <= eventModel.EndingDate) || 
                                 (e.EndingDate >= eventModel.BeginingDate && e.EndingDate <= eventModel.EndingDate) || 
                                 (e.BeginingDate >= eventModel.BeginingDate && e.EndingDate <= eventModel.EndingDate)) && 
                                 (e.ClassRoomId == eventModel.ClassRoomId));

                if (eventsInSameRange > 0)
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
                var userEmail = context.AspNetUsers
                    .Where(u => u.Id == eventModel.UserId)
                    .Select(u => u.Email).FirstOrDefault();

                context.Events.Add(events);
                context.Participants.Add(new Participants
                {
                    EventId = events.Id,
                    Email = userEmail
                });
                context.SaveChanges();
            }
            finally
            {
                context.Dispose();
            }

        }

        public IEnumerable<EventModel> Get()
        {
            var eventsList = new List<EventModel>();

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

        public EventModel Get(int id)
        {
            using (var context = new ClassBookingContext())
            {
                return MapService.Map(context.Events.Find(id));
            }
        }

        public IEnumerable<EventModel> GetBrief()
        {
            var todayDate = DateTime.Now.Date;
            var eventsList = new List<EventModel>();

            using (var context = new ClassBookingContext())
            {
                    var eventsBrief = context.Events.Where(e => DbFunctions.TruncateTime(e.BeginingDate) == todayDate)
                    .Select(e => new EventModel
                    {
                        Id = e.Id,
                        Title = e.Title,
                        ClassRoomId = e.ClassRoomId,
                        BeginingDate = e.BeginingDate,
                        EndingDate = e.EndingDate,
                        IsPrivate = e.IsPrivate,
                        Description = e.Description.Substring(0, maxCharactersInBriefDescription)
                    }).ToList();

                    foreach (var eventBrief in eventsBrief)
                    {
                        eventsList.Add(eventBrief);
                    }
                }

            return eventsList;
        }

        public IEnumerable<EventModel> Get(Expression<Func<EventModel, bool>> where)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<EventModel> GetM(Expression<Func<EventModel, bool>> where)
        {
            throw new NotImplementedException();
        }

        public void Remove(EventModel classRoom)
        {
            throw new NotImplementedException();
        }

        public void Update(EventModel classRoom)
        {
            throw new NotImplementedException();
        }


    }
}
