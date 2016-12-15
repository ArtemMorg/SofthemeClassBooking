using System;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Models
{
    public class EventModel : IEvent
    {
        public string Title { get; set; }
        public string UserId { get; set; }

        public int ClassRoomId { get; set; }

        public DateTime BeginingDate { get; set; }

        public string Description { get; set; }

        public DateTime EndingDate { get; set; }

        public int Id { get; set; }

        public bool IsAuthorShown { get; set; }

        public bool IsPrivate { get; set; }

        public bool IsParticipantsAllowed { get; set; }

        public string Organizer { get; set; }


    }
}
