using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SofthemeClassBooking_DAL
{
    public partial class Events
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Events()
        {
            Participants = new HashSet<Participants>();
        }

        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        [StringLength(128)]
        public string UserId { get; set; }

        public int ClassRoomId { get; set; }

        [StringLength(50)]
        public string Organizer { get; set; }

        public DateTime BeginingDate { get; set; }

        public DateTime EndingDate { get; set; }

        [StringLength(300)]
        public string Description { get; set; }

        public bool IsPrivate { get; set; }

        public bool IsAuthorShown { get; set; }

        public bool IsParticipantsAllowed { get; set; }

        public virtual AspNetUsers AspNetUsers { get; set; }

        public virtual ClassRooms ClassRooms { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Participants> Participants { get; set; }
    }
}
