using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SofthemeClassBooking.Models
{
    
        public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        private const string DangerMessagePath = "<img src='../Content/images/danger.png'/> ";
        private const string ErrorEmailMessage = DangerMessagePath + "Неверный адрес электронной почты";
        private const string ErrorEmptyMessage = DangerMessagePath + "Это поле обязательно для заполения";
        [Required(ErrorMessage = ErrorEmptyMessage)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$", ErrorMessage = ErrorEmailMessage)]
        
        public string Email { get; set; }
    }

    public class LoginViewModel
    {
        private const string DangerMessagePath = "<img src='../Content/images/danger.png'/> ";
        private const string ErrorEmptyMessage = DangerMessagePath + "Это поле обязательно для заполения";
        private const string ErrorMessageMaxLengthReached = DangerMessagePath + "Поле слишком длинное";
        private const string ErrorEmailMessage = DangerMessagePath + "Неверный адрес электронной почты";
       

        [StringLength(50, ErrorMessage = ErrorMessageMaxLengthReached)]
        [Required(ErrorMessage = ErrorEmptyMessage)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$", ErrorMessage = ErrorEmailMessage)]
        [Display(Name = "Email")]
       
        public string Email { get; set; }

        [Required(ErrorMessage = ErrorEmptyMessage)]
        [DataType(DataType.Password)]
        [StringLength(50, ErrorMessage = ErrorMessageMaxLengthReached)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        private const string DangerMessagePath = "<img src='../Content/images/danger.png'/> ";
        private const string ErrorEmptyMessage = DangerMessagePath + "Это поле обязательно для заполения";
        private const string ErrorMessageLengthReached = DangerMessagePath + "Пароль должен содержать <font face='Arial'>8-15</font> символов";
       
        private const string ErrorEmailMessage = DangerMessagePath + "Неверный адрес электронной почты";
        private const string ErrorMessageConfirmPassword = DangerMessagePath + "Пароль не совпадает";
        [Required(ErrorMessage = ErrorEmptyMessage)]
        [StringLength(70)]
        [Display(Name = "UserName")]
        public string UserName { get; set; }

        [StringLength(50)]
        [Required(ErrorMessage = ErrorEmptyMessage)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$", ErrorMessage = ErrorEmailMessage)]
        [Display(Name = "Email")]
    
        public string Email { get; set; }


        [Required(ErrorMessage = ErrorEmptyMessage)]
        [StringLength(15, ErrorMessage = ErrorMessageLengthReached, MinimumLength = 8)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = ErrorMessageConfirmPassword)]
        
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordViewModel
    {
        private const string DangerMessagePath = "<img src='/Content/images/danger.png'/> ";
        private const string ErrorMessageLengthReached = DangerMessagePath + "Пароль должен содержать <font face='Arial'>8-15</font> символов";
        private const string ErrorEmailMessage = DangerMessagePath + "Неверный адрес электронной почты";
        private const string ErrorConfirmationPassword =  DangerMessagePath +"Пароль не совпадает";
        private const string ErrorEmptyMessage = DangerMessagePath + "Это поле обязательно для заполения";
        
        
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$", ErrorMessage = ErrorEmailMessage)]
        public string Email { get; set; }

        [Required(ErrorMessage = ErrorEmptyMessage)]
        [StringLength(15, ErrorMessage = ErrorMessageLengthReached, MinimumLength = 8)]
        [Display(Name = "Password")]
        public string Password { get; set; }

      
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = ErrorConfirmationPassword)]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        private const string DangerMessagePath = "<img src='../Content/images/danger.png'/> ";
        private const string ErrorEmailMessage = DangerMessagePath + "Неверный адрес электронной почты";
        private const string ErrorEmptyMessage = DangerMessagePath + "Это поле обязательно для заполения";
        private const string ErrorMessageMaxLengthReached = DangerMessagePath + "Поле слишком длинное";

        [Required(ErrorMessage = ErrorEmptyMessage)]
        [StringLength(50, ErrorMessage = ErrorMessageMaxLengthReached)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$",
             ErrorMessage = ErrorEmailMessage)]
        [EmailAddress(ErrorMessage =ErrorEmailMessage)]
        public string Email { get; set; }
    }

}
