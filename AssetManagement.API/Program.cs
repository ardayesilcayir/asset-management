using AssetManagement.Infrastructure; // Bu using ekli olmalı

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------------
// 1. SERVİSLERİN EKLENDİĞİ BÖLÜM (BUILD'DEN ÖNCE)
// --------------------------------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS – Next.js frontend'ini izin ver
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// KRİTİK NOKTA: Veritabanı servisini burada kaydediyoruz.
// Eğer bu satır "var app = builder.Build();" satırından sonraysa hata alırsın.
builder.Services.AddInfrastructureServices(builder.Configuration);

// --------------------------------------------------------
// 2. UYGULAMANIN DERLENDİĞİ NOKTA
// --------------------------------------------------------
var app = builder.Build();

// --------------------------------------------------------
// 3. MIDDLEWARE (İSTEK HATTI) AYARLARI (BUILD'DEN SONRA)
// --------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// KRİTİK NOKTA 2: Uygulamayı başlatan komut. Bu yoksa "Entry point exited" hatası alırsın.
app.Run();
