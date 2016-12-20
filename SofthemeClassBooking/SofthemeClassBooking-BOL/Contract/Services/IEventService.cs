using System;
using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Contract.Services
{
    public interface IEventService<TModel> : IService<TModel>
        where TModel : IEvent
    {
        TModel Get(int id);
        IEnumerable<TModel> GetBrief(DateTime dateEventsFrom, DateTime dateEventsTo);

        IEnumerable<TModel> GetByUser(string id);
        void Update(IEvent eventModel, IEvent pivotModel);
        void RemoveAllEventsFromUser(string id);
        int GetNumberOfEventsByUser(string id);
    }
}
