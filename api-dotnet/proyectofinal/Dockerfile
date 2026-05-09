FROM mcr.microsoft.com/dotnet/sdk:10.0-preview 
WORKDIR /app 
COPY . . 
ENV ASPNETCORE_URLS=http://+:8080 
ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=true 
ENTRYPOINT ["sh", "-c", "sleep 20 && dotnet run --project proyectofinal.csproj --urls http://0.0.0.0:8080"] 
