using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Contract.Services
{
    public interface IEventService<TModel> : IService<TModel>
        where TModel : IEvent
    {
        TModel Get(int id);
        IEnumerable<TModel> GetBrief();
    }
}
