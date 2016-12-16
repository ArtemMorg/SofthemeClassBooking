using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Contract.Services
{
    public interface IFeedbackService<TModel> : IService<TModel>
        where TModel : IFeedback
    {

    }
}
