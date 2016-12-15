using System.ComponentModel.DataAnnotations;

namespace SofthemeClassBooking_DAL
{
    public partial class Feedbacks
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string Surname { get; set; }

        [Required]
        [StringLength(256)]
        public string Email { get; set; }

        [Required]
        [StringLength(3000)]
        public string Text { get; set; }
    }
}
