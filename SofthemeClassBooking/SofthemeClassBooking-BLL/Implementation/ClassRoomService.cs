using System;
using System.Collections.Generic;
using System.Data.Entity.Core;
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
    public class ClassRoomService : IClassRoomService<IClassRoom>
    {
        public void Add(IClassRoom classRoom)
        {
            using (var context = new ClassBookingContext())
            {
                context.ClassRooms.Add(MapService.Map(classRoom));
                context.SaveChanges();
            }
        }

        public IEnumerable<IClassRoom> Get()
        {
            var classRoomModel = new List<IClassRoom>();

            using (var context = new ClassBookingContext())
            {

                var classRooms = context.ClassRooms.ToList();
                foreach (var classRoom in classRooms)
                {
                    classRoomModel.Add(MapService.Map(classRoom));
                }

            }
            return classRoomModel;
        }

        public bool IsRoomBusy(IEvent eventModel)
        {
            return ServiceHelper.IsRoomBusy(eventModel);
        }

        public IEnumerable<object> GetNameId()
        {
            var listOfAttributes = new List<object>();

            using (var context = new ClassBookingContext())
            {
                var attributes = context.ClassRooms.Where(field => field.IsLocked == false)
                    .Select(field => new
                    {
                        field.Id,
                        field.Name
                    })
                    .ToList();

                foreach (var attribute in attributes)
                {
                    listOfAttributes.Add(attribute);
                }
            }

            return listOfAttributes;
        }

        public IClassRoom Get(int id)
        {
            using (var context = new ClassBookingContext())
            {
                return MapService.Map(context.ClassRooms.Find(id));
            }
        }

        public void Remove(IClassRoom classRoom)
        {
            var classRooms = new ClassRooms
            {
                Id = classRoom.Id
            };

            using (var context = new ClassBookingContext())
            {
                context.ClassRooms.Attach(classRooms);
                context.ClassRooms.Remove(classRooms);
                context.SaveChanges();
            }
        }

        public void Update(IClassRoom classRoom)
        {
            var updatedClassRoom = MapService.Map(classRoom);

            using (var context = new ClassBookingContext())
            {
                var old = context.ClassRooms.FirstOrDefault(c => c.Id == updatedClassRoom.Id);
                if (old != null)
                {
                    context.Entry(old).CurrentValues.SetValues(updatedClassRoom);
                    context.SaveChanges();
                }
                else
                {
                    throw new ObjectNotFoundException();
                }
            }
        }

        public void ChangeRoomStatus(int id, ClassRoomStatus classRoomStatus)
        {
            using (var context = new ClassBookingContext())
            {
                var classRoom = context.ClassRooms.Find(id);
                context.ClassRooms.Attach(classRoom);
                var entry = context.Entry(classRoom);
                switch (classRoomStatus)
                {
                    case ClassRoomStatus.Opened:
                        classRoom.IsLocked = false;
                        break;

                    case ClassRoomStatus.Closed:
                        classRoom.IsLocked = true;

                        var eventsToDelete = context.Events.Where(e => e.ClassRoomId == id).ToList();
                        foreach (var eventToDelete in eventsToDelete)
                        {
                            context.Participants.RemoveRange(
                                context.Participants.Where(p => p.EventId == eventToDelete.Id));
                        }

                        context.Events.RemoveRange(context.Events.Where(e => e.ClassRoomId == id));

                        break;
                }
                entry.Property(e => e.IsLocked).IsModified = true;
                context.SaveChanges();
            }
        }
    }
}
