using System;
using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_DAL;

namespace SofthemeClassBooking_BLL.Implementation
{
    public class FeedbackService : IFeedbackService<IFeedback>
    {
        public void Add(IFeedback feedbackModel)
        {
            using (var context = new ClassBookingContext())
            {
                context.Feedbacks.Add(MapService.Map(feedbackModel));
                context.SaveChanges();
            }
        }

        public IEnumerable<IFeedback> Get()
        {
            throw new NotImplementedException();
        }

        public void Remove(IFeedback model)
        {
            throw new NotImplementedException();
        }
    }
}
