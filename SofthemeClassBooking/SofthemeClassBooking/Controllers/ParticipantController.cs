using System;
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
            catch (ParticipantAlreadyRegisteredException)
            {
                return Json(new { message = Localization.Localization.ErrorEventAlreadyEnrolledPlaceholder, success = false });
            }
            catch (ParticipantCountReachedMaximumRoomCapacityException)
            {
                return Json(new { message = Localization.Localization.ErrorEventParticipantReachedMaximumPlaceholder, success = false });
            }

            return Json(new { message = Localization.Localization.InfoParticipantAddedSuccess, success = true });
        }

        [HttpPost]
        [Authorize]
        public ActionResult Remove(int id)
        {
            try
            {
                _participantService.Remove(new ParicipantModel { Id = id });
                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }
    }
}