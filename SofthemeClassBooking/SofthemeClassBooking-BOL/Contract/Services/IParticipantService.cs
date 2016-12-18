using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Contract.Services
{
    public interface IParticipantService<TModel> : IService<TModel>
        where TModel : IParticipant
    {
        IEnumerable<TModel> Get(int eventId);
        int GetCount(int eventId);

        bool IsTakePart(int eventId, string userId);
    }
}
