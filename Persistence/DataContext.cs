using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Persistence;
public class DataContext : IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions options) : base(options) { }
    public DbSet<Book> Books { get; set; }
    public DbSet<CustomerReview> CustomerReviews { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Librarian> Librarians { get; set; }
    public DbSet<BookCheckout> BookCheckouts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CustomerReview>()
            .HasOne(r => r.Book)
            .WithMany(b => b.CustomerReviews)
            .HasForeignKey(r => r.BookId);

        modelBuilder.Entity<CustomerReview>()
            .HasOne(r => r.Customer)
            .WithMany(c => c.CustomerReviews)
            .HasForeignKey(r => r.CustomerId);

        modelBuilder.Entity<Book>()
            .HasIndex(b => b.ISBN)
            .IsUnique();

        modelBuilder.Entity<BookCheckout>()
            .HasOne(bc => bc.Book)
            .WithMany(b => b.BookCheckouts)
            .HasForeignKey(bc => bc.BookId);
    }
}
