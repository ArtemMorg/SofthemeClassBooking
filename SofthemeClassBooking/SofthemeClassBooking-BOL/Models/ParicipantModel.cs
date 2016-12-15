using System.ComponentModel.DataAnnotations;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Models
{
    public class ParicipantModel : IParticipant
    {
        public int EventId { get; set; }
        public int Id { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

    }
}
