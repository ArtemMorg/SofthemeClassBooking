using System;

namespace SofthemeClassBooking_BOL.Contract.Models
{
    public interface IEvent
    {
         int Id { get; set; }

         string Title { get; set; }

         string UserId { get; set; }

         int ClassRoomId { get; set; }

         string Organizer { get; set; }

         DateTime BeginingDate { get; set; }

         DateTime EndingDate { get; set; }

         string Description { get; set; }

         bool IsPrivate { get; set; }

         bool IsAuthorShown { get; set; }

         bool IsParticipantsAllowed { get; set; }
    }
}
