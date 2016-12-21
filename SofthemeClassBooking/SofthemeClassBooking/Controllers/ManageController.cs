using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using PagedList;
using SofthemeClassBooking.Models;
using SofthemeClassBooking_BLL.Implementation;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;

namespace SofthemeClassBooking.Controllers
{
    [Authorize]
    public class ManageController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private readonly IEventService<IEvent> _eventService;

        public ManageController(IEventService<IEvent> eventService)
        {
            _eventService = eventService;
        }

        public ManageController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, IEventService<IEvent> eventService)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            _eventService = eventService;
        }

        public ApplicationSignInManager SignInManager
        {
            get { return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>(); }
            private set { _signInManager = value; }
        }

        public ApplicationUserManager UserManager
        {
            get { return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set { _userManager = value; }
        }

        //
        // GET: /Manage/Index
        [Authorize(Roles = "admin")]
        public ActionResult Index(UserSearchModel model)
        {


            int pageSize = 20;
            int pageNumber = (model.Page ?? 1);
            model.SearchResults = UserManager.Users.ToList().ToPagedList(pageNumber, pageSize);
            return View("~/Views/Home/UserList.cshtml", model);


        }

        [Authorize(Roles = "admin")]
        public ActionResult Search(UserSearchModel model)
        {
            const int pageSize = 20;
            const int pageNumber = 1;
            if (model.SearchButton != null)
            {

                var result = UserManager.Users.ToList()
                    .Where(p => p.UserName.StartsWith(model.SearchButton)).OrderBy(p => p.UserName);
                model.SearchResults = result.ToList().ToPagedList(pageNumber, pageSize);
                return View("~/Views/Home/UserList.cshtml", model);
            }
            return Index(new UserSearchModel { Page = 1 });

        }

        [Authorize(Roles = "admin")]

        public int GetNumberOfEventsByUser(string id)
        {
            return _eventService.GetByUser(id).Count();
        }


        [Authorize(Roles = "admin")]
        [HttpPost]

        public async Task<ActionResult> RemoveLogin(string userId)
        {

            ManageMessageId? message;
            string loginProvider = string.Empty;
            string providerKey = string.Empty;
            var result =
                await
                    UserManager.RemoveLoginAsync(userId,
                        new UserLoginInfo(loginProvider, providerKey));

            if (result.Succeeded)
            {
                var user = await UserManager.FindByIdAsync(userId);
                if (user != null)
                {
                    _eventService.RemoveAllEventsFromUser(user.Id);

                    result = await UserManager.DeleteAsync(user);
                    message = ManageMessageId.RemoveLoginSuccess;
                }
                else
                {
                    message = ManageMessageId.Error;
                }

            }
            else
            {

                message = ManageMessageId.Error;

            }
            return RedirectToAction("Index", "Manage", new { Message = message });
        }





        [Authorize]
        public async Task<ActionResult> ChangeUserNameEmail()
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null)
            {
                string email = user.Email;
                string name = user.UserName;

                bool isAdmin = UserManager.IsInRole(user.Id, "admin");
                return PartialView("~/Views/Home/ChangeUserNameEmail.cshtml",
                    new ChangeUserNameEmail() { Email = email, UserName = name, IsAdmin = isAdmin });
            }
            throw new Exception("error");
        }
        [Authorize]
        public async Task<IdentityResult> EditRole(ApplicationUser user, string role)
        {
            if (user != null || role != null)
            {
                var oldUser = await UserManager.FindByIdAsync(user.Id);
                var oldRole = UserManager.GetRoles(oldUser.Id).FirstOrDefault();


                if (oldRole != role)
                {
                    UserManager.RemoveFromRole(user.Id, oldRole);
                    UserManager.AddToRole(user.Id, role);
                }


            }
            else return IdentityResult.Failed();

            return await UserManager.UpdateAsync(user);

        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<ActionResult> SaveChangeUserNameEmail(ChangeUserNameEmail model)
        {
            var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user != null && model != null)
            {
                user.Email = model.Email;
                user.UserName = model.UserName;
                if (model.IsAdmin)
                {
                    await EditRole(user, "admin");

                }
                else
                {

                    var oldRole = UserManager.GetRoles(user.Id).FirstOrDefault();
                    string newRole = model.IsAdmin ? "admin" : "user";

                    if (oldRole != newRole)
                    {
                        UserManager.RemoveFromRole(user.Id, oldRole);
                        UserManager.AddToRole(user.Id, newRole);
                    }

                }
                var result = UserManager.Update(user);
                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    return RedirectToAction("Index", "Home");
                }

            }

            return View("~/Views/Home/Profile.cshtml");


        }


        //
        // POST: /Manage/ChangePassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<ActionResult> ChangePasswordFromUserProfile(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("~/Views/Home/Profile.cshtml", model);
            }
            var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                if (user != null)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    ViewData["ChangePasswordSuccess"] = "Success";
                }
                return View("~/Views/Home/Profile.cshtml", model);
            }
            AddErrors(result);
            return View("~/Views/Home/Profile.cshtml", model);


        }

        public ActionResult SetPassword()
        {
            return View();
        }




        [Authorize(Roles = "admin")]
        public ActionResult UserList(UserSearchModel model)
        {
            int pageSize = 20;
            int pageNumber = (model.Page ?? 1);
            model.SearchResults = UserManager.Users.ToList().ToPagedList(pageNumber, pageSize);
            return View("~/Views/Home/UserList.cshtml", model);
        }
        //




        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        private bool HasPhoneNumber()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PhoneNumber != null;
            }
            return false;
        }

        public enum ManageMessageId
        {
            AddPhoneSuccess,
            ChangePasswordSuccess,
            SetTwoFactorSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            RemovePhoneSuccess,
            Error
        }

        #endregion
    }
}