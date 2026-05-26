FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /app

# Copiamos el proyecto y restauramos
COPY *.csproj ./
RUN dotnet restore

# Copiamos todo lo demás y publicamos
COPY . ./
RUN dotnet publish -c Release -o out

# Imagen para correr la app
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "proyectofinal.dll"]