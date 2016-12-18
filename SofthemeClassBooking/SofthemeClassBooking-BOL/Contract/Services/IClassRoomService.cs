using System.Collections.Generic;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Enum;

namespace SofthemeClassBooking_BOL.Contract.Services
{
    public interface IClassRoomService<TModel> : IService<TModel> 
        where TModel: IClassRoom 
    {
        TModel Get(int id);
        void Update(TModel classRoom);
        void ChangeRoomStatus(int id, ClassRoomStatus classRoomStatus);
        IEnumerable<object> GetNameId();
        bool IsRoomBusy(IEvent eventModel);
    }
}
