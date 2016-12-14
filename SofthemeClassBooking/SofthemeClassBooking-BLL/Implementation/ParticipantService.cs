using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_DAL;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_BOL.Exceptions;

namespace SofthemeClassBooking_BLL.Implementation
{
    public class ParticipantService : IParticipantService<ParicipantModel>
    {
        public void Add(ParicipantModel participaModel)
        {
            using (var context = new ClassBookingContext())
            {
                var duplicatedEmails = context.Participants
                                        .Count(p => p.EventId == participaModel.EventId && 
                                               p.Email == participaModel.Email);

                if (duplicatedEmails > 0)
                {
                    throw new ParticipantAlreadyRegisteredException();
                }

                var alreadyRegisteredCount = context.Participants.Count(p => p.EventId == participaModel.EventId);
                var roomId =
                    context.Events.Where(e => e.Id == participaModel.Id).Select(e => e.ClassRoomId).FirstOrDefault();
                var roomCapacity =
                    context.ClassRooms.Where(c => c.Id == roomId).Select(c => c.Capacity).FirstOrDefault();

                if (alreadyRegisteredCount > roomCapacity)
                {
                    throw new ParticipantCountReachedMaximumRoomCapacityException();
                }

                context.Participants.Add(new Participants
                {
                    Email = participaModel.Email,
                    EventId = participaModel.EventId
                });
                context.SaveChanges();
            }
        }

        public IEnumerable<ParicipantModel> Get(int eventId)
        {
            var participantModelList = new List<ParicipantModel>();

            using (var context = new ClassBookingContext())
            {
                var participants =  context.Participants
                    .Where(p => p.EventId == eventId)
                    .ToList();
                foreach (var participant in participants)
                {
                    participantModelList.Add(MapService.Map(participant));
                }
            }

            return participantModelList;
        }

        public int GetCount(int eventId)
        {
            using (var context = new ClassBookingContext())
            {
                return context.Participants.Count(p => p.EventId == eventId);
            }
        }

        public void Remove(ParicipantModel classRoom)
        {
            throw new NotImplementedException();
        }

    }
}
