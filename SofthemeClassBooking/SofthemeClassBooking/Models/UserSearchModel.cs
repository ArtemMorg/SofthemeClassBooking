using PagedList;

namespace SofthemeClassBooking.Models
{
    public class UserSearchModel
    {
        public int? Page { get; set; }


        public IPagedList<ApplicationUser> SearchResults { get; set; }
        public string SearchButton { get; set; }
    }
}