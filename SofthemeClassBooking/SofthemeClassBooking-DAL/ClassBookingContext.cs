using System.Data.Entity;

namespace SofthemeClassBooking_DAL
{
    public partial class ClassBookingContext : DbContext
    {
        public ClassBookingContext()
            : base("name=ClassBookingContext")
        {
        }

        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<ClassRooms> ClassRooms { get; set; }
        public virtual DbSet<Events> Events { get; set; }
        public virtual DbSet<Feedbacks> Feedbacks { get; set; }
        public virtual DbSet<Participants> Participants { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRoles>()
                .HasMany(e => e.AspNetUsers)
                .WithMany(e => e.AspNetRoles)
                .Map(m => m.ToTable("AspNetUserRoles").MapLeftKey("RoleId").MapRightKey("UserId"));

            modelBuilder.Entity<AspNetUsers>()
                .HasMany(e => e.AspNetUserClaims)
                .WithRequired(e => e.AspNetUsers)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<AspNetUsers>()
                .HasMany(e => e.AspNetUserLogins)
                .WithRequired(e => e.AspNetUsers)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<AspNetUsers>()
                .HasMany(e => e.Events)
                .WithRequired(e => e.AspNetUsers)
                .HasForeignKey(e => e.UserId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<ClassRooms>()
                .HasMany(e => e.Events)
                .WithRequired(e => e.ClassRooms)
                .HasForeignKey(e => e.ClassRoomId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Events>()
                .HasMany(e => e.Participants)
                .WithRequired(e => e.Events)
                .HasForeignKey(e => e.EventId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Feedbacks>()
                .Property(e => e.Email)
                .IsUnicode(false);
        }
    }
}
