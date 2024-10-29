using Application.Authentication;
using Application.Books;
using MediatR;

namespace Api.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {

        services.AddDbContext<DataContext>(options =>
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (env == "Development")
            {
                // Use connection string from file.
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            }
            else
            {
                // prod connection
            }
        });

        services.AddCors(opt =>
        {
            opt.AddPolicy("CorsPolicy", policy =>
            {
                policy.AllowAnyHeader().WithExposedHeaders("WWW-Authenticate", "Pagination").AllowAnyMethod();
            });

            opt.AddPolicy("devPolicy", policy =>
           {
               policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:3000");
               policy.AllowAnyHeader().WithExposedHeaders("WWW-Authenticate", "Pagination").AllowAnyMethod().WithOrigins("http://localhost:3000");
           });
        });

        services.AddAutoMapper(typeof(MappingProfiles).Assembly);

        services.AddMediatR(typeof(MappingProfiles).Assembly);
        services.AddMediatR(typeof(BookService).Assembly);

        services.AddScoped<AuthenticationServices>();
        services.AddScoped<BookService>();

        services.AddSingleton<StartupTasks>();

        return services;
    }
}
