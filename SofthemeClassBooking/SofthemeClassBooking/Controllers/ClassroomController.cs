using System;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using SofthemeClassBooking.Models;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Enum;
using SofthemeClassBooking_BOL.Models;


namespace SofthemeClassBooking.Controllers
{
    public class ClassroomController : Controller
    {
        private IClassRoomService<IClassRoom> _classRoomService;
        private static object _lock = new object();
        // GET: Classroom
        public ClassroomController(IClassRoomService<IClassRoom> classRoomService)
        {
            _classRoomService = classRoomService;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Index()
        {
            var classRoomViewModel = new ClassRoomViewModel();

            try
            {
                classRoomViewModel.ClassRooms = _classRoomService.Get();
                classRoomViewModel.LoadParameters = PlanSectionLoadParameters.Normal;
                classRoomViewModel.SelectedClassRoom = 0;

                return PartialView(classRoomViewModel);
            }
            catch (Exception)
            {
                return Json(new {message = Localization.Localization.ErrorGeneralException, success = false});
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Index(int id, int loadParameters)
        {
            var classRoomViewModel = new ClassRoomViewModel();

            try
            {
                classRoomViewModel.ClassRooms = _classRoomService.Get();
                classRoomViewModel.LoadParameters = (PlanSectionLoadParameters)loadParameters;
                classRoomViewModel.SelectedClassRoom = id;

                return PartialView(classRoomViewModel);
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }

        [HttpGet]
        public ActionResult GetNameId()
        {
            var classRooms = _classRoomService.GetNameId();
            var jsonSerialiser = new JavaScriptSerializer();
            return Json(jsonSerialiser.Serialize(classRooms), JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult AdditionalInfo(int id, bool edit = false)
        {
            if (edit)
            {
                return PartialView("EditClassRoomInfo", _classRoomService.Get(id));
            }
            return PartialView(_classRoomService.Get(id));
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult AdditionalInfo(ClassRoomModel classRoomModel)
        {
            return PartialView("AdditionalInfo", classRoomModel);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult RoomPage(int id)
        {
            return View(_classRoomService.Get(id));
        }

        [HttpPost]
        //[Authorize(Roles = "Administrator")]
        public ActionResult Edit(ClassRoomModel classRoomModel)
        {
            if (ModelState.IsValid)
            {
                lock (_lock)
                {
                    _classRoomService.Update(classRoomModel);
                    return Json(new { success = true });
                }

            }
            return Json(new { success = false });
        }

        [HttpPost]
        [Authorize]
        public ActionResult IsRoomBusy(EventModel eventModel)
        {
            try
            {
                return _classRoomService.IsRoomBusy(eventModel) ? 
                    Json(new {message = Localization.Localization.ErrorRoomIsBusy, success = false}) :
                    Json(new { message = false, success = true});
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }
        

        [HttpPost]
        [Authorize]
        public ActionResult ChangeStatus(int id, int classRoomStatus)
        {
            if (ModelState.IsValid)
            {
                lock (_lock)
                {
                    _classRoomService.ChangeRoomStatus(id, (ClassRoomStatus)classRoomStatus);
                    return Json(new { success = true });
                }

            }
            return Json(new {  message = Localization.Localization.ErrorGeneralException, success = false });
        }
    }
}