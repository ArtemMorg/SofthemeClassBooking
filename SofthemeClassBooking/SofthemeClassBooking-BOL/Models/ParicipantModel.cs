using System.ComponentModel.DataAnnotations;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Models
{
    public class ParicipantModel : IParticipant
    {
        public int EventId { get; set; }
        public int Id { get; set; }

        [StringLength(256)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$")]
        public string Email { get; set; }

    }
}
