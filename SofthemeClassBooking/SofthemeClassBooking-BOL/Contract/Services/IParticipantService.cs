using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Contract.Services
{
    public interface IParticipantService<TModel>
        where TModel : IParticipant
    {
        void Add(TModel paticipantModel);
        IEnumerable<TModel> Get(int eventId);
        int GetCount(int eventId);
        void Remove(TModel paticipantModel);

    }
}
