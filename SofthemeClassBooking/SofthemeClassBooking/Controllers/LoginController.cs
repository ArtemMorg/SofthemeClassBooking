using System;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using SofthemeClassBooking.Models;

namespace SofthemeClassBooking.Controllers
{

    public class LoginController : Controller
    {

        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public LoginController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public LoginController()
        {

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

        [AllowAnonymous]
        public ActionResult Index(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [AllowAnonymous]
        public ActionResult Registration()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public ActionResult RegistrationEmail()
        {
            return View("RegistrationResult");
        }

        [AllowAnonymous]
        public ActionResult SofthemeLogin(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View("index");
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SofthemeLogin(LoginViewModel model, string returnUrl)
        {

            if (!ModelState.IsValid)
            {
                return View("index", model);
            }


            var user = await UserManager.FindByEmailAsync(model.Email);


            if (user != null)
            {
                if (!user.EmailConfirmed && !UserManager.IsInRole(user.Id, "admin"))
                {
                    ModelState.AddModelError("", Localization.Localization.PleaseConfirmEmail);
                    return View("Index", model);
                }

                var result =
                    await
                        SignInManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberMe,
                            shouldLockout: false);

                switch (result)
                {
                    case SignInStatus.Success:
                        await SignInAsync(user, model.RememberMe);
                        return RedirectToLocal(returnUrl);
                    case SignInStatus.Failure:
                    default:
                        ModelState.AddModelError("", Localization.Localization.InccorrectData);
                        ViewData["Login"] = "Error";
                        return View("Index", model);
                }


            }
            ViewData["Login"] = "Error";
            ModelState.AddModelError("", Localization.Localization.InccorrectData);
            return View("Index", model);


        }




        [Authorize(Roles = "admin")]
        public string UserIsAdmin(ApplicationUser user)
        {
            if (UserManager.IsInRole(user.Id, "admin"))
            {
                return "<span>Admin</span>";
            }
            return "";
        }

        //
        // GET: /Account/Register
        [HttpGet]
        [Authorize]
        public string GetUserEmail(string id)
        {

            return UserManager.FindById(id).Email;
        }

        [HttpPost]
        [Authorize]
        public string GetUserEmail()
        {

            return UserManager.FindById(User.Identity.GetUserId()).Email;
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SofthemeRegistration(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("Registration", model);
            }
            else
            {
                var user = new ApplicationUser { UserName = model.UserName, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {

                    result = await UserManager.AddToRoleAsync(user.Id, "user");
                    if (!result.Succeeded)
                    {
                        ModelState.AddModelError("", Localization.Localization.Error);
                        return View("Registration", model);
                    }
                    try
                    {
                        await UserManager.SendEmailAsync(user.Id, Localization.Localization.ConfirmEmail,
                            String.Format(
                                Localization.Localization.ConfirmEmailMessage,
                                user.UserName,
                                Url.Action("ConfirmEmail", "Login", new { Token = user.Id, Email = user.Email },
                                    Request.Url.Scheme)));
                    }
                    catch (Exception)
                    {

                        ModelState.AddModelError("", Localization.Localization.Error);
                    }



                    return RedirectToAction("Confirm", "Login", new { Email = user.Email });
                }
                ViewData["Registration"] = "error";
                ModelState.AddModelError("", Localization.Localization.UserWithThisDataIsExist);
            }


            return View("Registration", model);
        }

        public ActionResult RegistrationResult()
        {
            return View("RegistrationResult");
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Confirm()
        {

            return View("RegistrationResult");
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string token, string email)
        {
            ApplicationUser user = this.UserManager.FindById(token);
            if (user != null)
            {
                if (user.Email == email)
                {
                    user.EmailConfirmed = true;
                    await UserManager.UpdateAsync(user);
                    await SignInAsync(user, isPersistent: false);
                }

            }
            return RedirectToAction("Index", "Home");

        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(model.Email);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    ViewData["ForgotPassword"] = "error";
                    ModelState.AddModelError("", Localization.Localization.UserWithSuchEmailDoesNotExist);
                }
                else
                {
                    string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                    var callbackUrl = Url.Action("ResetPassword", "Login", new { Id = user.Id, code, Email = user.Email },
                        protocol: Request.Url.Scheme);
                    try
                    {
                        await UserManager.SendEmailAsync(user.Id, Localization.Localization.PasswordReset,
                            Localization.Localization.PasswordResetMessage +
                       " <a href=\"" + callbackUrl + "\">" + Localization.Localization.Reset + "</a>");

                    }
                    catch (Exception)
                    {

                        ModelState.AddModelError("", Localization.Localization.Reset);
                        return View("ForgotPassword", model);
                    }

                    return RedirectToAction("ForgotPasswordConfirmation", "Login");
                }
            }
            ViewData["Registration"] = "error";
            return View("ForgotPassword", model);
        }


        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }


        [AllowAnonymous]
        public ActionResult ResetPassword(string Email, string code)
        {
            if (code == null)
            {
                return View("Error");
            }
            else
            {
                var model = new ResetPasswordViewModel()
                {
                    Code = code,
                    Email = Email
                };
                return View(model);
            }
        }
        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError("", Localization.Localization.Error);
                return View(model);
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("ResetPasswordResult", "Login");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        public ActionResult ResetPasswordResult()
        {
            return View();
        }





        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Index", "Home");
        }
        private async Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
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

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion

    }
}