using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SofthemeClassBooking_DAL
{
    public partial class ClassRooms
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ClassRooms()
        {
            Events = new HashSet<Events>();
        }

        public int Id { get; set; }

        [Required]
        [StringLength(30)]
        public string Name { get; set; }

        public byte Capacity { get; set; }

        public byte QuantityOfBoards { get; set; }

        public byte QuantityOfPrinters { get; set; }

        public byte QuantityOfTables { get; set; }

        public byte QuantityOfLaptops { get; set; }

        public bool IsLocked { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Events> Events { get; set; }
    }
}
