using Api;
using Api.Extensions;
using Api.Middleware;
using Application.Authentication;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot/dist";
});


builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<SignUpValidator>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "testLibraryApp"); });
}

app.UseMiddleware<ExceptionMiddleware>();

using var scope = app.Services.CreateScope();

var services = scope.ServiceProvider;

var context = services.GetRequiredService<DataContext>();
var userManager = services.GetRequiredService<UserManager<AppUser>>();
var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

await StartupTasks.CreateRoles(roleManager, userManager);

if (app.Environment.IsDevelopment())
{
    await StartupTasks.CreateTestUsers(userManager, builder.Configuration);
    await StartupTasks.SeedBookData(context);
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseSpaStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseCors("devPolicy");
    app.UseDeveloperExceptionPage();
}


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = new List<string> { "index.html" }
});


app.UseSpa(spa =>
{
    spa.Options.SourcePath = "wwwroot/dist";

    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
    }
});

await app.RunAsync();