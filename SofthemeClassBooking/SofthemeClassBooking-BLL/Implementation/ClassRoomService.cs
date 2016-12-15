using System;
using System.Collections.Generic;
using System.Data.Entity.Core;
using System.Linq;
using System.Linq.Expressions;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Enum;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_DAL;


namespace SofthemeClassBooking_BLL.Implementation
{
    public class ClassRoomService : IClassRoomService<ClassRoomModel>
    {

        public void Add(ClassRoomModel classRoom)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ClassRoomModel> Get()
        {
            var classRoomModel = new List<ClassRoomModel>();

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

        public IEnumerable<ClassRoomModel> Get(Expression<Func<ClassRoomModel, bool>> where)
        {
            throw new NotImplementedException();
        }

        public ClassRoomModel Get(int id)
        {
            using (var context = new ClassBookingContext())
            {
                return MapService.Map(context.ClassRooms.Find(id));
            }
        }

        public void Remove(ClassRoomModel classRoom)
        {
            throw new NotImplementedException();
        }
        /*
         db.Users.Attach(updatedUser);
var entry = db.Entry(updatedUser);
entry.Property(e => e.Email).IsModified = true;
// other changed properties
db.SaveChanges();
*/
        public void Update(ClassRoomModel classRoom)
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
