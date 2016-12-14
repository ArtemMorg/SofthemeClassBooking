using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_BOL.Exceptions;

namespace SofthemeClassBooking.Controllers
{
    public class ParticipantController : Controller
    {
        private IParticipantService<ParicipantModel> _participantService;

        public ParticipantController(IParticipantService<ParicipantModel> participantService)
        {
            _participantService = participantService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Add(ParicipantModel paricipantModel)
        {
            try
            {
                _participantService.Add(paricipantModel);
            }
            catch (ParticipantAlreadyRegisteredException ex)
            {
                return Json(new {message = Localization.Localization.ErrorEventAlreadyEnrolledPlaceholder});
            }
            catch (ParticipantCountReachedMaximumRoomCapacityException ex)
            {
                return Json(new { message = Localization.Localization.ErrorEventParticipantReachedMaximumPlaceholder });
            }
            return Json(new {message = "ok"});
        }
    }
}