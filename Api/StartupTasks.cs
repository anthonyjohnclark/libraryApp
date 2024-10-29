using Bogus;

namespace Api;
public class StartupTasks
{
    public static async Task CreateRoles(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
    {
        // initializing custom roles 
        var RoleManager = roleManager;
        string[] roleNames = { "Librarian", "Customer", "Test" };
        IdentityResult roleResult;

        foreach (var roleName in roleNames)
        {
            var roleExist = await RoleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                roleResult = await RoleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }

    public static async Task CreateTestUsers(UserManager<AppUser> userManager, IConfiguration config)
    {
        // initializing custom roles 
        var UserManager = userManager;

        // Create Librarian User
        var librarianTestUser = new Librarian
        {
            UserName = config.GetSection("LibrarianUser").GetValue<string>("Username"),
            Email = config.GetSection("LibrarianUser").GetValue<string>("UserEmail"),
            DisplayName = "LibrarianUser"
        };

        string userPWD = config.GetSection("LibrarianUser").GetValue<string>("UserPassword");
        var _user = await UserManager.FindByEmailAsync(config.GetSection("LibrarianUser").GetValue<string>("UserEmail"));

        if (_user == null)
        {
            var createLibrarianUser = await UserManager.CreateAsync(librarianTestUser, userPWD);
            if (createLibrarianUser.Succeeded)
            {
                var _userRoles = await UserManager.GetRolesAsync(librarianTestUser);
                librarianTestUser.EmailConfirmed = true;
                if (!_userRoles.Contains("Librarian"))
                {
                    await UserManager.AddToRoleAsync(librarianTestUser, "Librarian");
                }
            }
        }

        // Create Customer User
        var customerTestUser = new Customer
        {
            UserName = config.GetSection("CustomerUser").GetValue<string>("Username"),
            Email = config.GetSection("CustomerUser").GetValue<string>("UserEmail"),
            DisplayName = "CustomerUser"
        };

        string customerUserPWD = config.GetSection("CustomerUser").GetValue<string>("UserPassword");
        var _customerUser = await UserManager.FindByEmailAsync(config.GetSection("CustomerUser").GetValue<string>("UserEmail"));

        if (_customerUser == null)
        {
            var createCustomerUser = await UserManager.CreateAsync(customerTestUser, customerUserPWD);
            if (createCustomerUser.Succeeded)
            {
                var _userRoles = await UserManager.GetRolesAsync(customerTestUser);
                customerTestUser.EmailConfirmed = true;
                if (!_userRoles.Contains("Customer"))
                {
                    await UserManager.AddToRoleAsync(customerTestUser, "Customer");
                }
            }
        }
    }

    public static async Task SeedBookData(DataContext context)
    {
        // Check if there are already books in the database
        if (context.Books.Any() && context.Books.Count() >= 50)
        {
            return; // The database is already seeded
        }

        // Create a Faker instance to generate books
        var faker = new Faker<Book>()
            .RuleFor(b => b.Title, f => f.Lorem.Sentence(3, 5))
            .RuleFor(b => b.Author, f => f.Name.FullName())
            .RuleFor(b => b.Description, f => f.Lorem.Paragraph())
            .RuleFor(b => b.CoverImage, f => f.Image.PicsumUrl())
            .RuleFor(b => b.AverageRating, f => f.Random.Double(1.0, 5.0))
            .RuleFor(b => b.Publisher, f => f.Company.CompanyName())
            .RuleFor(b => b.PublicationDate, f => f.Date.Past(10))
            .RuleFor(b => b.Category, f => f.PickRandom(new[] { "Science Fiction", "Romance", "Mystery", "Fantasy", "Non-Fiction", "Biography" }))
            .RuleFor(b => b.ISBN, f => f.Random.Replace("978-1-####-####-#"))
            .RuleFor(b => b.PageCount, f => f.Random.Int(100, 1000));

        // Generate a list of 50 fake books
        var books = faker.Generate(50);

        // Add generated books to the context
        await context.Books.AddRangeAsync(books);

        // Save changes to the database
        await context.SaveChangesAsync();

    }

}
