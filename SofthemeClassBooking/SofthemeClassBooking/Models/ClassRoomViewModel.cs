using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Enum;

namespace SofthemeClassBooking.Models
{
    public class ClassRoomViewModel
    {
        public IEnumerable<IClassRoom> ClassRooms { get; set; }
        public int SelectedClassRoom { get; set; }
        public PlanSectionLoadParameters LoadParameters { get; set; }
    }
}