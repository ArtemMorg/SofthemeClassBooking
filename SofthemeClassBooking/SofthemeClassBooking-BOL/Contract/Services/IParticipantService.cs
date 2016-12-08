﻿
using SofthemeClassBooking_BOL.Contract.Models;

namespace SofthemeClassBooking_BOL.Contract.Services
{
    public interface IParticipantService<TModel> : IService<TModel>
        where TModel : IParticipant
    {
    }
}
