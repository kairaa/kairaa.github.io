using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Sinks.Elasticsearch;
using TestProject.Api.DependencyRegister;
using TestProject.Application.DependencyRegister;
using TestProject.Infrastructure.DependencyRegister;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.UseSwaggerGen();

builder.Services.AddCors();

builder.Services.AddHealthChecks();

builder.Configuration.UseAzureAppConfiguration(builder.Environment);

builder.Services.AddAppConfigurationDependencies(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddApplicationDependencies();
builder.Services.AddPipelineBehaviors();
builder.Services.AddInfrastructureDependencies(builder.Configuration);

builder.Services.AddControllers();

builder.AddSerilog();

var app = builder.Build(); 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORRECT ORDER - This is the key fix:
app.UseHttpsRedirection();  // Move this to the top
app.UseRouting();           // Add this line
app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());  // CORS must be after UseRouting()
app.UseAuthentication();    // Auth middleware after CORS
app.UseAuthorization();     // Authorization after Authentication

app.MapHealthChecks("/healthz");
app.MapControllers();

app.Run();
