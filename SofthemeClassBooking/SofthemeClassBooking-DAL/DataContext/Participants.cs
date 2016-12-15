using System.ComponentModel.DataAnnotations;

namespace SofthemeClassBooking_DAL
{
    public partial class Participants
    {
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Email { get; set; }

        public int EventId { get; set; }

        public virtual Events Events { get; set; }
    }
}
