using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_DAL;
using SofthemeClassBooking_BOL.Exceptions;

namespace SofthemeClassBooking_BLL.Implementation
{
    public class ParticipantService : IParticipantService<IParticipant>
    {
        public void Add(IParticipant participaModel)
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
                    context.Events.Where(e => e.Id == participaModel.EventId).Select(e => e.ClassRoomId).FirstOrDefault();
                var roomCapacity =
                    context.ClassRooms.Where(c => c.Id == roomId).Select(c => c.Capacity).FirstOrDefault();

                if (alreadyRegisteredCount >= roomCapacity)
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
        public IEnumerable<IParticipant> Get()
        {
            throw new NotImplementedException();
        }


        public IEnumerable<IParticipant> Get(int eventId)
        {
            var participantModelList = new List<IParticipant>();

            using (var context = new ClassBookingContext())
            {
                var participants = context.Participants
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

        public void Remove(IParticipant paricipantModel)
        {
            using (var context = new ClassBookingContext())
            {
                var participants = new Participants
                {
                    Id = paricipantModel.Id
                };

                context.Participants.Attach(participants);
                context.Participants.Remove(participants);

                context.SaveChanges();
            }
        }

        public void Update(IParticipant model)
        {
            throw new NotImplementedException();
        }
    }
}
