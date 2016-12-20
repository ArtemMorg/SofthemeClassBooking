using System;
using System.Linq;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_DAL;

namespace SofthemeClassBooking_BLL.Implementation
{
    public static class ServiceHelper
    {
        public static bool IsRoomBusy(IEvent eventModel)
        {
            using (var context = new ClassBookingContext())
            {
                var eventsInSameRange = context.Events
                    .Count(
                        e => ((e.BeginingDate > eventModel.BeginingDate && e.BeginingDate < eventModel.EndingDate) ||
                              (e.EndingDate > eventModel.BeginingDate && e.EndingDate < eventModel.EndingDate) ||
                              (e.BeginingDate > eventModel.BeginingDate && e.BeginingDate < eventModel.EndingDate) ||
                              (e.BeginingDate < eventModel.BeginingDate && e.EndingDate > eventModel.EndingDate)) &&
                             (e.ClassRoomId == eventModel.ClassRoomId));

                if (eventsInSameRange > 0)
                {
                    return true;
                }
            }

            return false;
        }

        public static string GetUserEmail(string id)
        {
            using (var context = new ClassBookingContext())
            {
                return context.AspNetUsers.Where(u => u.Id == id)
                    .Select(u => u.Email)
                    .FirstOrDefault();
            }
        }

    }
}