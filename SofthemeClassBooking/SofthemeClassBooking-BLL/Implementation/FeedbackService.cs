using System;
using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_DAL;

namespace SofthemeClassBooking_BLL.Implementation
{
    public class FeedbackService : IFeedbackService<FeedbackModel>
    {
        public void Add(FeedbackModel feedbackModel)
        {
            using (var context = new ClassBookingContext())
            {
                context.Feedbacks.Add(MapService.Map(feedbackModel));
                context.SaveChanges();
            }
        }

        public IEnumerable<FeedbackModel> Get()
        {
            throw new NotImplementedException();
        }

    }
}
