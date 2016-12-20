using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SofthemeClassBooking.Helpers
{
    public static class DateTimeValidationHelper
    {
        private const int MinimumAllowedYear = 2015;

        public static bool IsDateTimeValid(DateTime dateFrom, DateTime dateTo)
        {
            if (DateTime.Compare(dateFrom, dateTo) > 0)
            {
                return false;
            }

            if ((dateFrom.Year < MinimumAllowedYear) || (dateTo.Year < MinimumAllowedYear))
            {
                return false;
            }

            return true;
        }
    }
}